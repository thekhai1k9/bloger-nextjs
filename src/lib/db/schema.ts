import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core'

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  // Lưu ID người dùng từ Supabase Auth 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profiles = pgTable('users', {
  id: uuid('id').primaryKey(), // ID này sẽ trùng với ID Auth của Supabase
  email: text('email').notNull(),
  role: text('role').default('user').notNull(), // 'user' hoặc 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})