const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
let Author = require("../../../models/authors");

const _ = require("lodash");
let server = require("../../../bin/www");
let mongod;
let db, validID;
describe("Authors", () => {
    beforeEach(async () => {
        try {
            await Author.deleteMany({});
            let author = new Author();
            author.name = "Yeats";
            author.introduction = "Irish poet and one of the foremost figures of 20th-century literature. " +
            "A pillar of the Irish literary establishment, he helped to found the Abbey Theatre, " +
            "and in his later years served two terms as a Senator of the Irish Free State.";
            await author.save();

            author = new Author();
            author.name = "Du Fu";
            author.introduction = "Du Fu was a prominent Chinese poet of the Tang dynasty.";
            await author.save();

            author = await Author.findOne({ name:"Yeats" });
            validID = author._id;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /authors", () => {
        it("should return all the authors", done => {
            request(server)
                .get("/authors")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try{
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, author => {
                            return { name: author.name};
                        });
                        expect(result).to.deep.include({ name: "Yeats" });
                        expect(result).to.deep.include({ name: "Du Fu" });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
});
