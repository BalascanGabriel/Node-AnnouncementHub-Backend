const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Import your Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Announcement API Tests', () => {
  it('should return a list of announcements', (done) => {
    chai.request(app)
      .get('/api/announcements/all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  //more test cases here
});
