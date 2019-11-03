const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");

let datastore = require("../../../models/users");

describe("Users", () => {
    beforeEach(() => {
        while (datastore.length > 0) {
            datastore.pop();
        }
        datastore.push({
            id: 1000000,
            paymenttype: "PayPal",
            amount: 1600,
            upvotes: 1
        });
        datastore.push({
            id: 1000001,
            paymenttype: "Direct",
            amount: 1100,
            upvotes: 2
        });
    });
    describe("GET /users", () => {
        it("should return all the users", done => {
            request(server)
                .get("/users")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(2);
                    const result = _.map(res.body, user => {
                        return { id: user.id, amount: user.amount };
                    });
                    expect(result).to.deep.include({ id: 1000000, amount: 1600 });
                    expect(result).to.deep.include({ id: 1000001, amount: 1100 });
                    done(err);
                });
        });
    });
    describe("GET /users/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching user", done => {
                request(server)
                    .get(`/users/${datastore[0].id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.deep.include(datastore[0]);
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/users/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect({ message: "User NOT Found!" }, (err, res) => {
                        done(err);
                    });
            });
        });
    });
    describe("POST /users", () => {
        it("should return confirmation message and update datastore", () => {
            const user = {
                paymenttype: "Visa",
                amount: 1200,
                upvotes: 0
            };
            return request(server)
                .post("/users")
                .send(user)
                .expect(200)
                .expect({ message: "User Added!" });
        });
        after(() => {
            return request(server)
                .get("/users")
                .expect(200)
                .then(res => {
                    expect(res.body.length).equals(3);
                    const result = _.map(res.body, user => {
                        return {
                            paymenttype: user.paymenttype,
                            amount: user.amount
                        };
                    });
                    expect(result).to.deep.include({ paymenttype: "Visa", amount: 1200 });
                });
        });
    });
    describe("PUT /users/:id/vote", () => {
        describe("when the id is valid", () => {
            it("should return a message and the user upvoted by 1", () => {
                return request(server)
                    .put(`/users/1000001/vote`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "User Successfully Upvoted!"
                        });
                        expect(resp.body.data).to.include({
                            id: 1000001,
                            upvotes: 3
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${datastore[1].id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({ id: datastore[1].id, upvotes: 3 });
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid user id", () => {
                return request(server)
                    .put("/users/1100001/vote")
                    .expect(404)
                    .expect({ message: "Invalid User Id!" });
            });
        });
    });  // end-PUT
    describe("DELETE /users", () => {
        describe("when the id is valid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete("/users/1000001")
                    .expect(200)
                    .expect({
                            message: 'User Successfully Deleted!',
                            data:
                                {id: 1000001, paymenttype: 'Direct', amount: 1100, upvotes: 2}
                        }
                    );
            });
            after(() => {
                return request(server)
                    .get("/users/1000001")
                    .expect(200)
                    .expect({message: "User NOT Found!"});
            });
        });
        describe("when the id is invalid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete("/users/1100001")
                    .expect(200)
                    .expect({message: "User NOT DELETED!"});
            });
        });
    });
    describe("PUT/users/:id", () => {
        describe("when the id is valid", () => {
            it("should return confirmation message and edit datastore", () => {
                return request(server)
                    .put(`/users/1000001/`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "User Successfully UpDated!"
                        });
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid user id", () => {
                return request(server)
                    .put("/users/1100001/vote")
                    .expect(404)
                    .expect({ message: "Invalid User Id!" });
            });
        });
    });
});
