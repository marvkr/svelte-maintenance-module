import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { maintenanceRecord } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
	const records = await db
		.select()
		.from(maintenanceRecord)
		.orderBy(desc(maintenanceRecord.createdAt));
	return json(records);
}

export async function POST({ request }: RequestEvent) {
	const data = await request.json();
	const now = new Date().toISOString();

	const newRecord = {
		...data,
		createdAt: now,
		updatedAt: now
	};

	const inserted = await db.insert(maintenanceRecord).values(newRecord).returning();
	return json(inserted[0]);
}

export async function DELETE({ url }: RequestEvent) {
	const id = Number(url.searchParams.get('id'));
	await db.delete(maintenanceRecord).where(eq(maintenanceRecord.id, id));
	return json({ success: true });
}

export async function PATCH({ request }: RequestEvent) {
	const data = await request.json();
	const now = new Date().toISOString();

	const updated = await db
		.update(maintenanceRecord)
		.set({ ...data, updatedAt: now })
		.where(eq(maintenanceRecord.id, data.id))
		.returning();

	return json(updated[0]);
}
