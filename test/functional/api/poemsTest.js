const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");

let datastore = require("../../../models/poems");

describe("Poems", () => {
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
    describe("GET /poems", () => {
        it("should return all the poems", done => {
            request(server)
                .get("/poems")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(2);
                    const result = _.map(res.body, poem => {
                        return { id: poem.id, amount: poem.amount };
                    });
                    expect(result).to.deep.include({ id: 1000000, amount: 1600 });
                    expect(result).to.deep.include({ id: 1000001, amount: 1100 });
                    done(err);
                });
        });
    });
    describe("GET /poems/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching poem", done => {
                request(server)
                    .get(`/poems/${datastore[0].id}`)
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
                    .get("/poems/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect({ message: "Poem NOT Found!" }, (err, res) => {
                        done(err);
                    });
            });
        });
    });
    describe("POST /poems", () => {
        it("should return confirmation message and update datastore", () => {
            const poem = {
                paymenttype: "Visa",
                amount: 1200,
                upvotes: 0
            };
            return request(server)
                .post("/poems")
                .send(poem)
                .expect(200)
                .expect({ message: "Poem Added!" });
        });
        after(() => {
            return request(server)
                .get("/poems")
                .expect(200)
                .then(res => {
                    expect(res.body.length).equals(3);
                    const result = _.map(res.body, poem => {
                        return {
                            paymenttype: poem.paymenttype,
                            amount: poem.amount
                        };
                    });
                    expect(result).to.deep.include({ paymenttype: "Visa", amount: 1200 });
                });
        });
    });
    describe("PUT /poems/:id/vote", () => {
        describe("when the id is valid", () => {
            it("should return a message and the poem upvoted by 1", () => {
                return request(server)
                    .put(`/poems/1000001/vote`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Poem Successfully Upvoted!"
                        });
                        expect(resp.body.data).to.include({
                            id: 1000001,
                            upvotes: 3
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/poems/${datastore[1].id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({ id: datastore[1].id, upvotes: 3 });
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid poem id", () => {
                return request(server)
                    .put("/poems/1100001/vote")
                    .expect(404)
                    .expect({ message: "Invalid Poem Id!" });
            });
        });
    });  // end-PUT
    describe("DELETE /poems", () => {
        describe("when the id is valid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete("/poems/1000001")
                    .expect(200)
                    .expect({
                            message: 'Poem Successfully Deleted!',
                            data:
                                {id: 1000001, paymenttype: 'Direct', amount: 1100, upvotes: 2}
                        }
                    );
            });
            after(() => {
                return request(server)
                    .get("/poems/1000001")
                    .expect(200)
                    .expect({message: "Poem NOT Found!"});
            });
        });
        describe("when the id is invalid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete("/poems/1100001")
                    .expect(200)
                    .expect({message: "Poem NOT DELETED!"});
            });
        });
    });
    describe("PUT/poems/:id", () => {
        describe("when the id is valid", () => {
            it("should return confirmation message and edit datastore", () => {
                return request(server)
                    .put(`/poems/1000001/`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Poem Successfully UpDated!"
                        });
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid poem id", () => {
                return request(server)
                    .put("/poems/1100001/vote")
                    .expect(404)
                    .expect({ message: "Invalid Poem Id!" });
            });
        });
    });

    describe("GET /poems/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching poem", done => {
                request(server)
                    .get(`/poems/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("title","On crime and punishment");
                        done(err);
                    });
            });
        });
        describe.only("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/poems/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Poem NOT Found!");
                        done(err);
                    });
            });
        });
    });
});
