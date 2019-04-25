import app from "../app";
import event from "../routes/api/secured/events";
import sinon from "sinon";
chai.should();
chai.expect();
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
describe("test APP.JS", () => {
  it("should get the'/api/events/'  ", done => {
    chai
      .request(app)
      .get("/api/events/")
      .end((err, res) => {
        console.log("====================================");
        console.log(res);
        // console.log('====================================');
        // let spyGetEvent = sinon.spy(event.)
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
