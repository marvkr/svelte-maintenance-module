import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { maintenanceStats, maintenanceByType, monthlyTrends } from '$lib/server/db/schema';
import { desc, asc } from 'drizzle-orm';

export async function GET() {
	const [stats] = await db
		.select()
		.from(maintenanceStats)
		.orderBy(desc(maintenanceStats.updatedAt))
		.limit(1);

	const types = await db.select().from(maintenanceByType);

	const trends = await db
		.select()
		.from(monthlyTrends)
		.orderBy(asc(monthlyTrends.year), asc(monthlyTrends.month))
		.limit(12);

	return json({
		stats,
		maintenanceByType: types,
		monthlyTrends: trends.map((trend) => ({
			group: trend.month,
			value: trend.count,
			key: trend.month
		}))
	});
}
