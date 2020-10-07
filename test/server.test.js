import { expect } from 'chai';
import request from 'supertest';
import app from '../index';

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
          date_from: '2016-01-01',
          date_to: '2016-01-10',
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
          date_from: '2016-01-0',
          date_to: '2016-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });

      it('should throw error for invalid value of date_to', async () => {
        const query = {
          date_from: '',
          date_to: '2016-01&',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty origin value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin: '',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty destinations value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin: 'CNSGH',
          destination: '',
        };
        const response = await request(app).get(`/rates/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
    });
    describe('GET /rates_null/', () => {
      it('should return values', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
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
          date_from: '2016-01-0',
          date_to: '2016-01-10',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });

      it('should throw error for invalid value of date_to', async () => {
        const query = {
          date_from: '',
          date_to: '2016-01&',
          origin: 'CNSGH',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty origin value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin: '',
          destination: 'north_europe_main',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty destinations value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin: 'CNSGH',
          destination: '',
        };
        const response = await request(app).get(`/rates_null/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
    });

    describe('POST/ upload_price/', () => {
      it('should upload a new price in DB', async () => {
        const query = {
          date_from: '2020-10-04',
          date_to: '2020-10-08',
          origin_code: 'NOIKR',
          destination_code: 'IESNN',
          price: 1080,
        };

        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(201);
        expect(response.body).to.have.property('rowCount');
        expect(response.body).to.have.property('message');
      });

      it('should throw error for invalid value of date_from', async () => {
        const query = {
          date_from: '2016-01-0',
          date_to: '2016-01-10',
          origin_code: 'NOIKR',
          destination_code: 'IESNN',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });

      it('should throw error for invalid value of date_to', async () => {
        const query = {
          date_from: '',
          date_to: '2016-01&',
          origin_code: 'NOIKR',
          destination_code: 'IESNN',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty origin_code value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: '',
          destination_code: 'IESNN',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an empty destinations value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: 'NOIKR',
          destination_code: '',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an invalid price value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: 'NOIKR',
          destination_code: 'IESNN',
          price: 'ADASD',
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for an negative price value', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-02',
          origin_code: 'NOIKR',
          destination_code: 'IESNN',
          price: -1,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for with not registered origin_code as port', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: 'TEST',
          destination_code: 'NOIKR',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for with not registered destination_code as port', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: 'TEST',
          destination_code: 'NOIKR',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('errors');
      });
      it('should throw error for with not registered destination_code and origin_code', async () => {
        const query = {
          date_from: '2016-01-01',
          date_to: '2016-01-10',
          origin_code: 'TEST',
          destination_code: 'TEST',
          price: 1080,
        };
        const response = await request(app).post(`/upload_price/`).query(query);
        expect(response.statusCode).to.equal(500);
        expect(response.body).to.have.property('errors');
      });
    });
  });
});
