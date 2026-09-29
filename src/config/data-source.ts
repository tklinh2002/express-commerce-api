// src/config/data-source.ts
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, 
  // Automatically create/update database tables based on entities.
  // Warning: Set to false in production to prevent data loss!
  synchronize: true, 
  // Set to true if you want to see the generated SQL queries in the console
  logging: false,    
  entities: [
    // Automatically load all files ending with .entity.ts or .entity.js
    __dirname + '/../**/*.entity{.ts,.js}'
  ],
  subscribers: [],
  migrations: [],
});
