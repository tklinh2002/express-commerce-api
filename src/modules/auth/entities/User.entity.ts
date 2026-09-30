import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

// Enum for User Roles (similar to how we define roles in NestJS)
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users') // Map to "users" table in the database
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    // IMPORTANT: We use select: false to prevent TypeORM from returning 
    // the password hash in queries by default (e.g. user details response).
    // When we need to check the password for login, we will explicitly request it.
    @Column({ type: 'varchar', select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    // Store refresh token for authenticating a new access token later
    @Column({ type: 'varchar', nullable: true })
    refreshToken!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
