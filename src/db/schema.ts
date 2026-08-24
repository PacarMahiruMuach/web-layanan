import { pgTable, serial, text, boolean, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  rt_number: text('rt_number').notNull(),
  reset_token: text('reset_token'),
  reset_token_expires: timestamp('reset_token_expires'),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  no_rt: text('no_rt').notNull(),
  no_wa: text('no_wa').notNull(),
  judul: text('judul').notNull(),
  deskripsi: text('deskripsi').notNull(),
  alamat: text('alamat').notNull(),
  urgensi: text('urgensi').notNull(),
  kategori: text('kategori').notNull(),
  status: text('status').notNull().default('Menunggu'),
  is_escalated_to_rw: boolean('is_escalated_to_rw').notNull().default(false),
  bukti: text('bukti'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const residents = pgTable('residents', {
  id: serial('id').primaryKey(),
  nama_lengkap: text('nama_lengkap').notNull(),
  no_rumah: text('no_rumah').notNull(),
  no_rt: text('no_rt').notNull(),
  status_tinggal: text('status_tinggal').notNull(),
  no_telepon: text('no_telepon'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  type: text('type').default('news').notNull(),
  event_date: timestamp('event_date'),
  location: text('location'),
  image: text('image'),
  author: text('author').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  receipt: text('receipt'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  condition: text('condition').notNull(),
  is_borrowed: boolean('is_borrowed').default(false).notNull(),
  borrower_name: text('borrower_name'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const system_logs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 255 }).notNull(),
  description: text('description').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
