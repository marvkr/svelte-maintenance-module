<script lang="ts">
	import { DataTable, Button, Tag, InlineLoading, Search } from 'carbon-components-svelte';
	import MaintenanceForm from '$lib/components/maintenance-form.svelte';
	import type { MaintenanceRecord } from '$lib/server/db/schema';

	let searchTerm = $state('');
	let rows = $state<MaintenanceRecord[]>([]);
	let loading = $state(false);
	let formOpen = $state(false);
	let selectedRecord = $state<Partial<MaintenanceRecord>>({});

	const headers = [
		{ key: 'title', value: 'Title' },
		{ key: 'status', value: 'Status' },
		{ key: 'priority', value: 'Priority' },
		{ key: 'createdAt', value: 'Created' },
		{ key: 'actions', value: 'Actions', empty: true }
	];

	async function loadRecords() {
		loading = true;
		try {
			const response = await fetch('/api/maintenance');
			rows = await response.json();
			console.log('Loaded records:', rows);
		} catch (error) {
			console.error('Failed to load records:', error);
		}
		loading = false;
	}

	async function handleSubmit(data: Partial<MaintenanceRecord>) {
		const method = data.id ? 'PATCH' : 'POST';
		await fetch('/api/maintenance', {
			method,
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		});
		loadRecords();
	}

	async function handleDelete(id: number) {
		if (confirm('Are you sure you want to delete this record?')) {
			await fetch(`/api/maintenance?id=${id}`, { method: 'DELETE' });
			loadRecords();
		}
	}

	function openEditForm(record: MaintenanceRecord) {
		selectedRecord = record;
		formOpen = true;
	}

	function openNewForm() {
		selectedRecord = {};
		formOpen = true;
	}

	$effect(() => {
		loadRecords();
	});
</script>

<div class="maintenance-module">
	<header class="module-header">
		<h1>Maintenance Records</h1>
		<div class="header-actions">
			<Search
				size="lg"
				bind:value={searchTerm}
				placeholder="Search records..."
				class="search-input"
			/>
			<Button class="action-button" on:click={openNewForm}>New Record</Button>
		</div>
	</header>

	{#if loading}
		<InlineLoading description="Loading records..." />
	{:else}
		<DataTable
			{headers}
			{rows}
			sortable
			zebra
			size="compact"
			title="Maintenance Records"
			description="List of all maintenance tasks"
		>
			<svelte:fragment slot="cell" let:row let:cell>
				{#if cell.key === 'status'}
					<Tag
						type={row.status === 'completed'
							? 'green'
							: row.status === 'in-progress'
								? 'blue'
								: 'gray'}
					>
						{row.status}
					</Tag>
				{:else if cell.key === 'priority'}
					<Tag
						type={row.priority === 'high' ? 'red' : row.priority === 'medium' ? 'purple' : 'teal'}
					>
						{row.priority}
					</Tag>
				{:else if cell.key === 'actions'}
					<div class="actions">
						<Button kind="ghost" size="small" on:click={() => openEditForm(row)}>Edit</Button>
						<Button kind="danger-ghost" size="small" on:click={() => handleDelete(row.id)}>
							Delete
						</Button>
					</div>
				{:else}
					{cell.value}
				{/if}
			</svelte:fragment>
		</DataTable>
	{/if}

	<MaintenanceForm
		bind:open={formOpen}
		record={selectedRecord}
		onSubmit={handleSubmit}
		onClose={() => (formOpen = false)}
	/>
</div>

<style>
	.maintenance-module {
		padding: 2rem;
	}

	.module-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.module-header h1 {
		font-size: 2rem;
		font-weight: 400;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	:global(.action-button) {
		padding-right: 1rem;
	}

	:global(.search-input) {
		height: 3rem;
	}
</style>
