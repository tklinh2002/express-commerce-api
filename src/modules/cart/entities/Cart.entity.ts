import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '../../auth/entities/User.entity';
import { CartItem } from './CartItem.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // RELATIONSHIP: One User has exactly One Cart (1-1)
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // Explicitly define userId for easier access
  @Column({ type: 'uuid' })
  userId!: string;

  // RELATIONSHIP: One Cart can have Many CartItems (1-N)
  // 'cascade: true' means saving the cart will also save its items
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items!: CartItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
