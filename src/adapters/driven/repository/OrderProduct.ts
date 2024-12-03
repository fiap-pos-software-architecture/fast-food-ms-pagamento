import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { IOrderProduct } from '../../../core/domain/OrderProduct';
import { Order } from './Order';

@Entity()
export class OrderProduct extends BaseEntity implements IOrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;
  @ManyToOne(() => Order, (Order) => Order.orderProducts)
  order: Relation<Order>;

  @Column()
  productId: number;

  @Column('int')
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;
}
