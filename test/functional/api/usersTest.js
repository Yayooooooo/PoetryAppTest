const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");

let User = require("../../../models/users");
let validID;

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
    describe.only("GET /users", () => {
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
});
