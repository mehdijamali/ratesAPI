import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index';

describe('SERVER', () => {
  it('GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Welcome to the rates API');
  });

  describe('RATES API ENDPOINTS', () => {
    describe('GET /rates/', () => {
      it('should return values', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);
        expect(response.statusCode).to.equal(200);
        expect(response.body[0]).to.have.property('day');
        expect(response.body[0]).to.have.property('average_price');
      });

      it('should throw error for invalid value of date_from', async () => {
        const query = {
          date_from: '2020-01-0',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });

      it('should throw error for invalid value of date_to', async () => {
        const query = {
          date_from: '',
          date_to: '2020-01&',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
      it('should throw error for an empty origin value', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: '',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);

        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
      it('should throw error for an empty destinations value', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: '',
        };
        const response = await request(app).get(`/rates/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
    });
    describe('GET /rates_null/', () => {
      it('should return values', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(200);
        expect(response.body[0]).to.have.property('day');
        expect(response.body[0]).to.have.property('average_price');
      });

      it('should throw error for invalid value of date_from', async () => {
        const query = {
          date_from: '2020-01-0',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });

      it('should throw error for invalid value of date_to', async () => {
        const query = {
          date_from: '',
          date_to: '2020-01&',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
      it('should throw error for an empty origin value', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: '',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
      it('should throw error for an empty destinations value', async () => {
        const query = {
          date_from: '2020-01-01',
          date_to: '2020-01-10',
          origin: 'CNSGH',
          destination: '',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('error');
      });
    });
  });

  it('should upload a new price in DB', () => {
    const item = {
      date_from: '2020-10-04',
      date_to: '2020-10-08',
      origin_code: 'NOIKR',
      destination_code: 'IESNN',
      price: 1080,
    };

    // db.uploadPrice({ query: item }, reponse);
  });
});
