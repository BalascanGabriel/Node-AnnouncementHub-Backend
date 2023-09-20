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
  it('should return a specific announcement by ID', (done) => {
    chai.request(app)
      .get('/api/announcements/INSERT_VALID_ANNOUNCEMENT_ID_HERE')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        // Add more assertions as needed to match your announcement schema
        done();
      });
  });

  //3
  it('should create a new announcement', (done) => {
    const newAnnouncement = {
      title: 'New Announcement',
      description: 'This is a new announcement.',
      price: 100,
      location: 'New York',
      category: 'General',
    };
    chai.request(app)
      .post('/api/announcements/new')
      .send(newAnnouncement)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', newAnnouncement.title);
        expect(res.body).to.have.property('description', newAnnouncement.description);
        // Add more assertions as needed to match your announcement schema
        done();
      });
  });

  
});
