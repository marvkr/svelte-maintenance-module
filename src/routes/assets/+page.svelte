<script lang="ts">
	import { DataTable, Button, Tag, Pagination, Search } from 'carbon-components-svelte';

	let searchTerm = $state('');
	let page = $state(1);
	let pageSize = $state(10);

	type Asset = {
		id: string;
		name: string;
		type: string;
		status: string;
		location: string;
		lastMaintenance: string;
		nextMaintenance: string;
	};

	const headers = [
		{ key: 'id', value: 'Asset ID' },
		{ key: 'name', value: 'Name' },
		{ key: 'type', value: 'Type' },
		{ key: 'status', value: 'Status' },
		{ key: 'location', value: 'Location' },
		{ key: 'lastMaintenance', value: 'Last Maintenance' },
		{ key: 'nextMaintenance', value: 'Next Maintenance' }
	] as const;

	const assets: Asset[] = [
		{
			id: 'AST001',
			name: 'Production Line A',
			type: 'Machinery',
			status: 'Operational',
			location: 'Building 1',
			lastMaintenance: '2024-01-15',
			nextMaintenance: '2024-04-15'
		},
		{
			id: 'AST002',
			name: 'HVAC Unit 3B',
			type: 'HVAC',
			status: 'Needs Attention',
			location: 'Building 2',
			lastMaintenance: '2023-12-01',
			nextMaintenance: '2024-03-01'
		}
		// Add more sample data as needed
	];
</script>

<div class="assets-module">
	<header class="module-header">
		<h1>Asset Management</h1>
		<div class="header-actions">
			<Search
				size="lg"
				bind:value={searchTerm}
				placeholder="Search assets..."
				class="search-input"
			/>
			<Button class="action-button">Add New Asset</Button>
		</div>
	</header>

	<DataTable
		{headers}
		rows={assets}
		sortable
		zebra
		size="compact"
		title="Asset List"
		description="List of all assets"
	>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === 'status'}
				<Tag
					type={row.status === 'Operational'
						? 'green'
						: row.status === 'Needs Attention'
							? 'cyan'
							: 'red'}
				>
					{row.status}
				</Tag>
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
	</DataTable>

	<Pagination bind:page bind:pageSize totalItems={assets.length} pageSizes={[10, 20, 30, 40, 50]} />
</div>

<style>
	.assets-module {
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
