import app from "../app";
chai.should();
chai.expect();
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
describe("test APP.JS", () => {
  it("should get the'/' routes ", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
  it("should get the'/api' routes ", done => {
    chai
      .request(app)
      .get("/api")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
