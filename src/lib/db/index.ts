import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Lấy chuỗi connection từ biến môi trường
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in your .env.local file')
}

// Khởi tạo driver postgres client
const client = postgres(connectionString, {prepare: false})

// Khởi tạo instance db của Drizzle
export const db = drizzle(client, {schema})
