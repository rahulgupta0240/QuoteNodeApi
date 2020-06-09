/* eslint-disable no-undef */
import  supertest from 'supertest';
import app from '../app';

describe('Get Quotes', () => {
      it('should return 401 status code', async () => {
        const response = await supertest(app)
          .get('/quotes');
        expect(response.statusCode).toEqual(401);
      });
    });