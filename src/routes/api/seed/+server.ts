import { json } from '@sveltejs/kit';
import { seedDashboardData } from '$lib/server/db/seed';

export async function POST() {
	try {
		await seedDashboardData();
		return json({ success: true, message: 'Database seeded successfully' });
	} catch (error) {
		console.error('Seeding error:', error);
		return json({ success: false, error: 'Failed to seed database' }, { status: 500 });
	}
}
