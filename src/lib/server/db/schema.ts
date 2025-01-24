import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

export const maintenanceRecord = sqliteTable('maintenance_record', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status', { enum: ['pending', 'in-progress', 'completed'] }).notNull(),
	priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull(),
	assignedTo: integer('assigned_to').references(() => user.id),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
	completedAt: text('completed_at')
});

// Zod Schemas
export const insertMaintenanceSchema = createInsertSchema(maintenanceRecord);
export const selectMaintenanceSchema = createSelectSchema(maintenanceRecord);

// Types
export type MaintenanceRecord = z.infer<typeof selectMaintenanceSchema>;
export type NewMaintenanceRecord = z.infer<typeof insertMaintenanceSchema>;

// Add these to your existing schema
export const maintenanceStats = sqliteTable('maintenance_stats', {
	id: integer('id').primaryKey(),
	pending: integer('pending').notNull(),
	inProgress: integer('in_progress').notNull(),
	completed: integer('completed').notNull(),
	total: integer('total').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const maintenanceByType = sqliteTable('maintenance_by_type', {
	id: integer('id').primaryKey(),
	type: text('type').notNull(),
	count: integer('count').notNull()
});

export const monthlyTrends = sqliteTable('monthly_trends', {
	id: integer('id').primaryKey(),
	month: text('month').notNull(),
	count: integer('count').notNull(),
	year: integer('year').notNull()
});

// Add Zod schemas for new tables
export const insertMaintenanceStatsSchema = createInsertSchema(maintenanceStats);
export const selectMaintenanceStatsSchema = createSelectSchema(maintenanceStats);

export const insertMaintenanceByTypeSchema = createInsertSchema(maintenanceByType);
export const selectMaintenanceByTypeSchema = createSelectSchema(maintenanceByType);

export const insertMonthlyTrendsSchema = createInsertSchema(monthlyTrends);
export const selectMonthlyTrendsSchema = createSelectSchema(monthlyTrends);

// Add types
export type MaintenanceStats = z.infer<typeof selectMaintenanceStatsSchema>;
export type NewMaintenanceStats = z.infer<typeof insertMaintenanceStatsSchema>;

export type MaintenanceByType = z.infer<typeof selectMaintenanceByTypeSchema>;
export type NewMaintenanceByType = z.infer<typeof insertMaintenanceByTypeSchema>;

export type MonthlyTrend = z.infer<typeof selectMonthlyTrendsSchema>;
export type NewMonthlyTrend = z.infer<typeof insertMonthlyTrendsSchema>;
