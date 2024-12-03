import request from 'supertest';
import router from './orderRoute';

describe('Testando rotas de Order', () => {

  it('deve responder com os dados do pedido quando GET /orders', async () => {
    const userId = '123';
    const response = await request(router).get(`/orders`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId });
  });
});
