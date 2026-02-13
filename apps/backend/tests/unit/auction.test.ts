import request from 'supertest';
import app from '../../src/index';

describe('Auction API', () => {
  test('GET /api/auctions returns 200', async () => {
    const res = await request(app).get('/api/auctions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/auctions requires auth', async () => {
    const res = await request(app)
      .post('/api/auctions')
      .send({ item_id: 'test', reserve_price: '1000000' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /health returns status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });
});
