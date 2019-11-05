const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");

let User = require("../../../models/users");
let validID;
let idForTest;

describe("Users", () => {
    beforeEach(async () => {
        try {
            await User.deleteMany({});
            let user = new User();
            user.username = "YeatsFans";
            user.email = "LovYeats@lala.com"
            user.password= "trytry123";
            user.gender="Male";
            await user.save();

            user = new User();
            user.username = "DufuFans";
            user.email = "LoveDF@haha.com"
            user.password= "trytry345";
            user.gender="Female";
            await user.save();

            user = await User.findOne({username:"YeatsFans"});
            validID = user._id;
        } catch (error) {
            console.log(error);
        }
    });
    describe("GET /users", () => {
        it("should return all the users", done => {
            request(server)
                .get("/users")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try{
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, user => {
                            return { username: user.username};
                        });
                        expect(result).to.deep.include({ username: "YeatsFans" });
                        expect(result).to.deep.include({ username: "DufuFans" });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
    describe("GET /users/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching user", done => {
                request(server)
                    .get(`/users/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("username","YeatsFans");
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
                    .end((err, res) => {
                        expect(res.body.message).equals("User NOT Found!");
                        done(err);
                    });
            });
        });
    });
    describe("POST /users/login", () => {
        describe("when the logemail and logpassword are valid", () => {
            it("should return confirmation message and update datastore", () => {
                const user = {
                    logemail :"LoveDF@haha.com",
                    logpassword: "trytry345"
                };
                return request(server)
                    .post("/users/login")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("User Successfully Login!");
                        validID = res.body.data;
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("username", "DufuFans");
                    });
            });
        });
        describe("when the logemail is invalid", () => {
            it("should return information is wrong", () => {
                const user = {
                    logemail :"LoveF@haha.com",
                    logpassword: "trytry345"
                };
                return request(server)
                    .post("/users/login")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Wrong email or password!");
                    });
            });
        });
        describe("when the logpassword is invalid", () => {
            it("should return information is wrong", () => {
                const user = {
                    logemail :"LoveDF@haha.com",
                    logpassword: "try345"
                };
                return request(server)
                    .post("/users/login")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Wrong email or password!");
                    });
            });
        });
    });
    describe("POST /usersRegister", () => {
        describe("when the all fields are filled and valid, password and passwordConf match", () => {
            it("should return the matching user", done => {
                const user = {
                    email :"LoveWS@ho.com",
                    username:"WilliamShakespeareFan",
                    password: "trytry456",
                    passwordConf: "trytry456",
                    gender: "Female"
                };
                return request(server)
                    .post("/usersRegister")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("User Successfully Added(Registered)!");
                        validID = res.body.data._id;
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("username", "WilliamShakespeareFan");
                    });
            });
        });
        describe("when the not all fields are filled", () => {
            it("should return the err message", done => {
                const user = {
                    email :"LoveWS@ho.com",
                    password: "trytry456",
                    passwordConf: "trytry456",
                    gender: "Female"
                };
                return request(server)
                    .post("/usersRegister")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("All fields required");
                    });
            });
        });
        describe("when the password and passwordConf dont match", () => {
            it("should return error message", done => {
                const user = {
                    email :"LoveWS@ho.com",
                    username:"WilliamShakespeareFan",
                    password: "trytry456",
                    passwordConf: "trytr456",
                    gender: "Female"
                };
                return request(server)
                    .post("/usersRegister")
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals("Passwords do not match.");
                    });
                    /*.set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Passwords do not match.");
                        done(err);
                    });*/
            });
        });
    });
    describe("DELETE /users", () => {
        describe("when the id is valid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete(`/users/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('User Successfully Deleted!');
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validID}`)
                    .expect(200)
                    .expect([]);
            });
        });
        describe.only("when the id is invalid", () => {
            it("should return confirmation message and delete datastore", () => {
                return request(server)
                    .delete("/donations/1100001")
                    .expect(404)
                    .expect({});
            });
        });
    });
});
