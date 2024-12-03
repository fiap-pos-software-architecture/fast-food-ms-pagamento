import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { IOrder, PAYMENT_STATUS, PROCESS_STATUS } from '../../../core/domain/Order';
import { OrderProduct } from './OrderProduct';

@Entity()
export class Order extends BaseEntity implements IOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderProduct, (OrderProduct) => OrderProduct.order, { eager: true })
  orderProducts: Relation<OrderProduct[]>;

  @Column({ nullable: true })
  customerId: number;

  @Column({
    type: 'enum',
    enum: PROCESS_STATUS,
    default: PROCESS_STATUS.RECEBIDO,
  })
  processStage: PROCESS_STATUS;

  @Column({ type: 'float', nullable: true })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  paymentStatus: PAYMENT_STATUS;

  @CreateDateColumn({ name: 'createdAt', update: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', update: false })
  updatedAt: Date;
}
