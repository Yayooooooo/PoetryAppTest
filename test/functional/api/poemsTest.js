const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
let validID;
let Poem = require("../../../models/poems");

describe("Poems", () => {
    beforeEach(async () => {
        try {
            await Poem.deleteMany({});
            let poem = new Poem();
            poem.title = "On children";
            poem.author = "Kahlil Gibran"
            await poem.save();

            poem = new Poem();
            poem.title = "MyPoem";
            poem.author = "Xiaoming"
            await poem.save();

            poem = await Poem.findOne({author:"Xiaoming"});
            validID = poem._id;
        } catch (error) {
            console.log(error);
        }
    });
    describe("GET /poems", () => {
        it("should return all the poems", done => {
            request(server)
                .get("/poems")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try{
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, poem => {
                            return { title: poem.title};
                        });
                        expect(result).to.deep.include({ title: "On children" });
                        expect(result).to.deep.include({ title: "MyPoem" });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
    describe.only("GET /poems/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching poem", done => {
                request(server)
                    .get(`/poems/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("author","Xiaoming");
                        done(err);
                    });
            });
        });
    });

});
