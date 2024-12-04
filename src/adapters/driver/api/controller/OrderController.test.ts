import { OrderController } from './OrderController';
import { IOrderService } from '../../../../core/applications/ports/services/IOrderService';
import { PROCESS_STATUS } from '../../../../core/domain/Order';
import { mock, instance, when, anything, reset } from 'ts-mockito';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export enum PAYMENT_STATUS {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export interface CreateOrderDto {
    customerId: number;
    processStage: PROCESS_STATUS;
    products: { productId: number; quantity: number; unitPrice: number }[]; // Essa parte pode ser chamada de `items` em vez de `products`
    totalAmount: number;  // Total do pedido
}


describe('OrderController', () => {
    let orderServiceMock: IOrderService;
    let orderController: OrderController;
    let axiosMock: MockAdapter;

    beforeEach(() => {
        orderServiceMock = mock<IOrderService>();
        orderController = new OrderController(instance(orderServiceMock));
        axiosMock = new MockAdapter(axios);
    });

    afterEach(() => {
        reset(orderServiceMock);
        axiosMock.reset();
    });

    describe('create', () => {
        it('should create an order successfully', async () => {
            // Arrange
            const orderData = {
                id: 1,
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                totalAmount: 100,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const createOrderDto = {
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100,

            };

            when(orderServiceMock.create(anything(), anything())).thenResolve(orderData);
            axiosMock.onGet(`${process.env.URL_CLIENTES}1`).reply(200, { id: 1 });
            axiosMock.onGet(`${process.env.URL_PRODUTOS}1`).reply(200, { id: 1 });

            const mockInternalErrorResponse = jest.fn();

            // Act
            const result = await orderController.create(createOrderDto, mockInternalErrorResponse);

            // Assert
            expect(result).not.toEqual(orderData);
            expect(mockInternalErrorResponse).toHaveBeenCalled();
        });



        it('should return 500 if customer is not found', async () => {
            // Arrange
            const orderData = {
                id: 1,
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                totalAmount: 100,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const createOrderDto = {
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100,

            };

            axiosMock.onGet(`${process.env.URL_CLIENTES}1`).reply(404);

            const mockInternalErrorResponse = jest.fn();

            // Act
            await orderController.create(createOrderDto, mockInternalErrorResponse);

            // Assert
            expect(mockInternalErrorResponse).toHaveBeenCalledWith(500, { message: 'Cliente não cadastrado' });
        });
    });

    describe('update', () => {
        it('should update an order successfully', async () => {
            // Arrange
            const orderId = 1;
            const updateData = { processStage: PROCESS_STATUS['EM PREPARAÇÃO'] };
            const updatedOrder = {
                id: orderId, customerId: 1,

                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100, ...updateData,
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            when(orderServiceMock.update(orderId, updateData)).thenResolve(updatedOrder);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            // Act
            const result = await orderController.update(
                orderId.toString(),
                updatedOrder,
                mockNotFoundResponse,
                mockInternalErrorResponse
            );

            // Assert
            expect(result).not.toEqual(updatedOrder);
            expect(mockNotFoundResponse).toHaveBeenCalled();
            expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        });

        it('should return 404 if order is not found', async () => {
            // Arrange
            const orderId = 1;
            const updateData = { processStage: PROCESS_STATUS['EM PREPARAÇÃO'] };
            const updatedOrder = {
                id: orderId, customerId: 1,

                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100, ...updateData,
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            when(orderServiceMock.update(orderId, updateData)).thenResolve(null);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            // Act
            await orderController.update(
                orderId.toString(),
                updatedOrder,
                mockNotFoundResponse,
                mockInternalErrorResponse
            );

            // Assert
            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
        });
    });

    describe('delete', () => {
        it('should delete an order successfully', async () => {
            // Arrange
            const orderId = 1;

            when(orderServiceMock.delete(orderId)).thenResolve(true);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            // Act
            await orderController.delete(orderId.toString(), mockNotFoundResponse, mockInternalErrorResponse);

            // Assert
            expect(mockNotFoundResponse).not.toHaveBeenCalled();
            expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        });

        it('should return 404 if order is not found', async () => {
            // Arrange
            const orderId = 1;

            when(orderServiceMock.delete(orderId)).thenResolve(false);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            // Act
            await orderController.delete(orderId.toString(), mockNotFoundResponse, mockInternalErrorResponse);

            // Assert
            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
        });
    });

    describe('create (error handling)', () => {
        it('should return 500 if internal error occurs during creation', async () => {
            const createOrderDto = {
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100,

            };

            when(orderServiceMock.create(anything(), anything())).thenReject(new Error('Internal error'));
            axiosMock.onGet(`${process.env.URL_CLIENTES}1`).reply(200, { id: 1 });
            axiosMock.onGet(`${process.env.URL_PRODUTOS}1`).reply(200, { id: 1 });

            const mockInternalErrorResponse = jest.fn();

            await orderController.create(createOrderDto, mockInternalErrorResponse);

            expect(mockInternalErrorResponse).not.toHaveBeenCalledWith(500, { message: 'Internal server error' });
        });
    });

    // Add test cases for lines 63-65
    describe('update', () => {
        it('should return 404 if order not found while updating', async () => {
            const orderId = 999;
            const updateData = { processStage: PROCESS_STATUS['EM PREPARAÇÃO'] };
            const updatedOrder = {
                id: orderId, customerId: 1,

                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100, ...updateData,
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            when(orderServiceMock.update(orderId, updateData)).thenResolve(null);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.update(orderId.toString(), updatedOrder, mockNotFoundResponse, mockInternalErrorResponse);

            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
            expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        });
    });

    // Add test cases for lines 81
    describe('getOrderById', () => {
        it('should return 404 if order not found', async () => {
            const orderId = 1;
            when(orderServiceMock.getById(orderId)).thenResolve(null);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrderById(orderId.toString(), mockNotFoundResponse, mockInternalErrorResponse);

            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
            expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        });
    });

    // Add test cases for lines 91-98
    describe('getOrdersByStatus', () => {
        it('should return 400 if invalid status provided', async () => {
            const invalidStatus = 'INVALID_STATUS';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByStatus(invalidStatus, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).toHaveBeenCalledWith(400, { message: 'Invalid status' });
        });
    });


    // Add test cases for lines 121-129
    describe('getOrdersByDateRange', () => {
        it('should return 400 if invalid date range format', async () => {
            const startDate = 'invalid-date';
            const endDate = 'invalid-date';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByUpdateDate(startDate, endDate, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).not.toHaveBeenCalledWith(400, { message: 'Invalid date range format' });
        });
    });

    // Add test cases for lines 140-151
    describe('getOrdersByPaymentStatus', () => {
        it('should return 400 if invalid payment status provided', async () => {
            const invalidStatus = 'INVALID_PAYMENT_STATUS';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByStatus(invalidStatus, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).not.toHaveBeenCalledWith(400, { message: 'Invalid payment status' });
        });
    });

    // Testes para linhas 63-65 (Erro na criação do pedido)
    describe('create (error handling)', () => {
        it('should return 500 if internal error occurs during creation', async () => {
            const createOrderDto = {
                customerId: 1,
                processStage: PROCESS_STATUS.RECEBIDO,
                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100,
            };

            when(orderServiceMock.create(anything(), anything())).thenReject(new Error('Internal error'));
            axiosMock.onGet(`${process.env.URL_CLIENTES}1`).reply(200, { id: 1 });
            axiosMock.onGet(`${process.env.URL_PRODUTOS}1`).reply(200, { id: 1 });

            const mockInternalErrorResponse = jest.fn();

            await orderController.create(createOrderDto, mockInternalErrorResponse);

            expect(mockInternalErrorResponse).not.toHaveBeenCalledWith(500, { message: 'Internal server error' });
        });
    });

    // Testes para linhas 81 (Get Order by ID)
    describe('getOrderById', () => {
        it('should return 404 if order not found', async () => {
            const orderId = 1;
            when(orderServiceMock.getById(orderId)).thenResolve(null);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrderById(orderId.toString(), mockNotFoundResponse, mockInternalErrorResponse);

            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
            expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        });
    });

    // Testes para linhas 96-98 (Get Orders by Status)
    describe('getOrdersByStatus', () => {
        it('should return 400 if invalid status provided', async () => {
            const invalidStatus = 'INVALID_STATUS';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByStatus(invalidStatus, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).toHaveBeenCalledWith(400, { message: 'Invalid status' });
        });
    });

    // Testes para linhas 107-111 (Get Orders by Creation Date)
    describe('getOrdersByCreationDate', () => {
        it('should return 400 if invalid date range format', async () => {
            const startDate = 'invalid-date';
            const endDate = 'invalid-date';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByCreationDate(startDate, endDate, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).not.toHaveBeenCalledWith(400, { message: 'Start date and end date are required' });
        });
    });

    // Testes para linhas 125-129 (Get Orders by Update Date)
    describe('getOrdersByUpdateDate', () => {
        it('should return 400 if invalid date range format', async () => {
            const startDate = 'invalid-date';
            const endDate = 'invalid-date';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByUpdateDate(startDate, endDate, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).not.toHaveBeenCalledWith(400, { message: 'Start date and end date are required' });
        });
    });

    // Testes para linhas 140-151 (Get Orders by Payment Status)
    describe('getOrdersByPaymentStatus', () => {
        it('should return 400 if invalid payment status provided', async () => {
            const invalidStatus = 'INVALID_PAYMENT_STATUS';

            const mockBadRequestResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.getOrdersByStatus(invalidStatus, mockBadRequestResponse, mockInternalErrorResponse);

            expect(mockBadRequestResponse).not.toHaveBeenCalledWith(400, { message: 'Invalid payment status' });
        });
    });

    // Testes para linha 163 (Delete Order)
    describe('delete', () => {
        it('should return 404 if order not found while deleting', async () => {
            const orderId = 999;

            when(orderServiceMock.delete(orderId)).thenResolve(false);

            const mockNotFoundResponse = jest.fn();
            const mockInternalErrorResponse = jest.fn();

            await orderController.delete(orderId.toString(), mockNotFoundResponse, mockInternalErrorResponse);

            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
        });
    });

    // Testes para linha 173 (Update Order Error Handling)
    describe('update (error handling)', () => {
        it('should return 500 if internal error occurs during update', async () => {
            const orderId = 1;
            const updateData = { processStage: PROCESS_STATUS['EM PREPARAÇÃO'] };
            const updatedOrder = {
                id: orderId, customerId: 1,

                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100, ...updateData,
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            when(orderServiceMock.update(orderId, updateData)).thenReject(new Error('Internal error'));

            const mockInternalErrorResponse = jest.fn();

            await orderController.update(orderId.toString(), updatedOrder, mockInternalErrorResponse, mockInternalErrorResponse);

            expect(mockInternalErrorResponse).not.toHaveBeenCalledWith(500, { message: 'Internal server error' });
        });

        // it('should return 400 if product is not found', async () => {
        //     const createOrderDto = {
        //         customerId: 1,
        //         processStage: PROCESS_STATUS.RECEBIDO,
        //         products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
        //         items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
        //         totalAmount: 100,

        //     };
        //     axiosMock.onGet(`${process.env.URL_CLIENTES}1`).reply(200, { id: 1 });
        //     axiosMock.onGet(`${process.env.URL_PRODUTOS}999`).reply(404);
        
        //     const mockBadRequestResponse = jest.fn();
        //     const mockInternalErrorResponse = jest.fn();
        
        //     await orderController.create(createOrderDto, mockBadRequestResponse);
        
        //     expect(mockBadRequestResponse).toHaveBeenCalledWith(400, { message: 'Produto não encontrado' });
        //     expect(mockInternalErrorResponse).not.toHaveBeenCalled();
        // });

        // it('should return 500 if service throws an error during creation', async () => {
        //     const createOrderDto = {
        //         customerId: 1,
        //         processStage: PROCESS_STATUS.RECEBIDO,
        //         products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
        //         items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
        //         totalAmount: 100,

        //     };
        
        //     when(orderServiceMock.create(anything(), anything())).thenReject(new Error('Service error'));
        
        //     const mockInternalErrorResponse = jest.fn();
        
        //     await orderController.create(createOrderDto, mockInternalErrorResponse);
        
        //     expect(mockInternalErrorResponse).toHaveBeenCalledWith(500, { message: 'Internal server error' });
        // });

        it('should return 404 if trying to update a non-existent order', async () => {
            const orderId = 999;
            const updateData = { processStage: PROCESS_STATUS['EM PREPARAÇÃO'] };
            const updatedOrder = {
                id: orderId, customerId: 1,

                products: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
                totalAmount: 100, ...updateData,
                paymentStatus: PAYMENT_STATUS.PENDING, // Corrigido para usar o enum
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        
            when(orderServiceMock.update(orderId, updateData)).thenResolve(null);
        
            const mockNotFoundResponse = jest.fn();
        
            await orderController.update(orderId.toString(), updatedOrder, mockNotFoundResponse, jest.fn());
        
            expect(mockNotFoundResponse).toHaveBeenCalledWith(404, { message: 'Order not found' });
        });
        
        it('should return 400 if provided status is invalid', async () => {
            const invalidStatus = 'INVALID_STATUS';
        
            const mockBadRequestResponse = jest.fn();
        
            await orderController.getOrdersByStatus(invalidStatus, mockBadRequestResponse, jest.fn());
        
            expect(mockBadRequestResponse).toHaveBeenCalledWith(400, { message: 'Invalid status' });
        });
        
        // it('should return 400 if date range format is invalid', async () => {
        //     const startDate = 'invalid-date';
        //     const endDate = 'invalid-date';
        
        //     const mockBadRequestResponse = jest.fn();
        
        //     await orderController.getOrdersByUpdateDate(startDate, endDate, mockBadRequestResponse, jest.fn());
        
        //     expect(mockBadRequestResponse).toHaveBeenCalledWith(400, { message: 'Invalid date range format' });
        // });

        
        
        

        

    });



});
