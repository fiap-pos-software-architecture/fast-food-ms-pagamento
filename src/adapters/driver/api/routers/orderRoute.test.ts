// import request from 'supertest';
// import express from 'express';
// import router from './orderRoute'; // Atualize com o caminho correto

// // Mock do serviço de pedido
// jest.mock('../../../../core/applications/services/OrderService', () => ({
//   OrderService: jest.fn().mockImplementation(() => ({
//     create: jest.fn().mockResolvedValue({ id: 1, customerId: 123, processStage: 'RECEBIDO' }),
//     update: jest.fn().mockResolvedValue({ id: 1, processStage: 'PROCESSANDO' }),
//     delete: jest.fn().mockResolvedValue(true),
//     getOrderById: jest.fn().mockResolvedValue({ id: 1, customerId: 123, processStage: 'RECEBIDO' }),
//     getAllOrders: jest.fn().mockResolvedValue([{ id: 1, customerId: 123 }]),
//     getOrdersByStatus: jest.fn().mockResolvedValue([{ id: 1, processStage: 'PROCESSANDO' }]),
//     getOrdersByCreationDate: jest.fn().mockResolvedValue([{ id: 1, createdAt: '2024-01-01' }]),
//     getOrdersByUpdateDate: jest.fn().mockResolvedValue([{ id: 1, updatedAt: '2024-02-01' }]),
//   })),
// }));

// // Instância do app Express para testes
// const app = express();
// app.use(express.json());
// app.use(router);

// describe('Order API Routes', () => {
//   it('POST /orders - Criação de pedido', async () => {
//     const response = await request(app).post('/orders').send({        
//         customerId: 123,
//         totalAmount: 150.5,
//         items: [
//           {
//             productId: 1,
//             quantity: 2,
//             unitPrice: 75.25,
//           },
//         ],
//       });
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//   });

//   it('PUT /orders/:id - Atualização de pedido', async () => {
//     const response = await request(app).put('/orders/1').send({ processStage: 'PROCESSANDO' });
//     expect(response.status).toBe(200);
//     expect(response.body).toMatchObject({ id: 1, processStage: 'PROCESSANDO' });
//   });

//   it('DELETE /orders/:id - Exclusão de pedido', async () => {
//     const response = await request(app).delete('/orders/1');
//     expect(response.status).toBe(204);
//   });

//   it('GET /orders/:id - Obter pedido por ID', async () => {
//     const response = await request(app).get('/orders/1');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id', 1);
//   });

//   it('GET /orders - Obter todos os pedidos', async () => {
//     const response = await request(app).get('/orders');
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it('GET /orders/status/:status - Obter pedidos por status', async () => {
//     const response = await request(app).get('/orders/status/PROCESSANDO');
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it('GET /orders/creation-date - Obter pedidos por data de criação', async () => {
//     const response = await request(app).get('/orders/creation-date').query({
//       startDate: '2024-01-01',
//       endDate: '2024-02-01',
//     });
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it('GET /orders/update-date - Obter pedidos por data de atualização', async () => {
//     const response = await request(app).get('/orders/update-date').query({
//       startDate: '2024-01-01',
//       endDate: '2024-02-01',
//     });
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });
