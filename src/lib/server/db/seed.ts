import { db } from './index';
import { maintenanceRecord } from './schema';
import { maintenanceStats, maintenanceByType, monthlyTrends } from './schema';

async function seed() {
	const testRecords = [
		{
			title: 'Fix Air Conditioning',
			description: 'Unit 3B AC needs repair',
			status: 'pending' as const,
			priority: 'high' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			title: 'Replace Light Bulbs',
			description: 'Lobby lights need replacement',
			status: 'in-progress' as const,
			priority: 'medium' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			title: 'Repair Production Line B',
			description: 'Conveyor belt malfunction',
			status: 'pending' as const,
			priority: 'high' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			title: 'Safety Inspection',
			description: 'Annual safety equipment check',
			status: 'completed' as const,
			priority: 'medium' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			completedAt: new Date().toISOString()
		},
		{
			title: 'Electrical System Maintenance',
			description: 'Regular electrical system checkup',
			status: 'in-progress' as const,
			priority: 'low' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	] as const;

	try {
		// Clear existing records first
		await db.delete(maintenanceRecord);
		await db.delete(maintenanceStats);
		await db.delete(maintenanceByType);
		await db.delete(monthlyTrends);

		// Insert maintenance records
		for (const record of testRecords) {
			await db.insert(maintenanceRecord).values(record);
		}

		// Also seed dashboard data
		await seedDashboardData();

		console.log('All data seeded successfully');
	} catch (error) {
		console.error('Error seeding data:', error);
	}
}

export async function seedDashboardData() {
	// Seed maintenance stats
	await db.insert(maintenanceStats).values({
		pending: 12,
		inProgress: 8,
		completed: 45,
		total: 65,
		updatedAt: new Date().toISOString()
	});

	// Seed maintenance by type
	await db.insert(maintenanceByType).values([
		{ type: 'Machinery', count: 15 },
		{ type: 'HVAC', count: 10 },
		{ type: 'Electrical', count: 20 },
		{ type: 'Plumbing', count: 8 },
		{ type: 'Safety', count: 12 }
	]);

	// Seed monthly trends with realistic data
	const currentYear = new Date().getFullYear();
	const monthlyData = [
		{ month: 'Jan', count: 32 },
		{ month: 'Feb', count: 28 },
		{ month: 'Mar', count: 45 },
		{ month: 'Apr', count: 38 },
		{ month: 'May', count: 42 },
		{ month: 'Jun', count: 35 },
		{ month: 'Jul', count: 48 },
		{ month: 'Aug', count: 52 },
		{ month: 'Sep', count: 40 },
		{ month: 'Oct', count: 45 },
		{ month: 'Nov', count: 38 },
		{ month: 'Dec', count: 30 }
	];

	await db.insert(monthlyTrends).values(
		monthlyData.map((data) => ({
			month: data.month,
			count: data.count,
			year: currentYear
		}))
	);
}

seed();
