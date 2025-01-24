import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { maintenanceRecord } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
	try {
		const count = await db.select({ count: sql`count(*)` }).from(maintenanceRecord);

		return json({
			success: true,
			message: 'Database connected',
			count: count[0].count
		});
	} catch (error) {
		console.error('Database error:', error);
		return json(
			{
				success: false,
				error: 'Database connection failed'
			},
			{ status: 500 }
		);
	}
}
