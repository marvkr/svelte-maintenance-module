<script lang="ts">
	import { Grid, Row, Column, Tile, ProgressBar } from 'carbon-components-svelte';
	import { DonutChart, BarChartSimple } from '@carbon/charts-svelte';
	import '@carbon/charts/styles.css';
	import { ArrowUp, ArrowDown } from 'carbon-icons-svelte';
	import type { MaintenanceStats, MaintenanceByType, MonthlyTrend } from '$lib/server/db/schema';
	import { ScaleTypes } from '@carbon/charts';

	let maintenanceStats = $state<MaintenanceStats | null>(null);
	let pieData = $state([]);
	let barData = $state([]);

	async function loadDashboardData() {
		const response = await fetch('/api/dashboard');
		const data = await response.json();

		maintenanceStats = data.stats;

		pieData = data.maintenanceByType.map((item: MaintenanceByType) => ({
			group: item.type,
			value: item.count
		}));

		barData = data.monthlyTrends.map((item: MonthlyTrend) => ({
			group: item.month,
			value: item.count
		}));
	}

	$effect(() => {
		loadDashboardData();
	});

	const pieOptions = {
		title: 'Maintenance by Type',
		height: '300px',
		theme: 'white',
		resizable: true,
		legend: {
			alignment: 'center'
		},
		donut: {
			center: {
				label: 'Tasks'
			}
		}
	};

	const barOptions = {
		title: 'Monthly Trends',
		height: '300px',
		theme: 'white',
		axes: {
			left: {
				mapsTo: 'value',
				title: 'Tasks',
				scaleType: ScaleTypes.LINEAR,
				includeZero: true
			},
			bottom: {
				mapsTo: 'group',
				title: 'Month',
				scaleType: ScaleTypes.LABELS
			}
		},
		data: {
			groupMapsTo: 'group'
		},
		grid: {
			x: {
				enabled: false
			},
			y: {
				enabled: true
			}
		},
		color: {
			scale: {
				Tasks: '#8a3ffc' // Purple color for bars
			}
		}
	};
</script>

<div class="dashboard">
	<h1>Maintenance Dashboard</h1>

	<Grid>
		<Row class="mb-6">
			<Column>
				<Tile>
					<h3>Total Tasks</h3>
					<div class="stat">{maintenanceStats?.total}</div>
					<ProgressBar value={70} helperText="70% completion rate" />
				</Tile>
			</Column>
			<Column>
				<Tile>
					<h3>Pending</h3>
					<div class="stat warning">{maintenanceStats?.pending}</div>
				</Tile>
			</Column>
			<Column>
				<Tile>
					<h3>In Progress</h3>
					<div class="stat info">{maintenanceStats?.inProgress}</div>
				</Tile>
			</Column>
			<Column>
				<Tile>
					<h3>Completed</h3>
					<div class="stat success">{maintenanceStats?.completed}</div>
				</Tile>
			</Column>
		</Row>

		<Row>
			<Column>
				<Tile>
					<h3>Maintenance by Type</h3>
					<DonutChart data={pieData} options={pieOptions} />
				</Tile>
			</Column>
			<Column>
				<Tile>
					<h3>Monthly Trends</h3>
					<BarChartSimple data={barData} options={barOptions} />
				</Tile>
			</Column>
		</Row>
	</Grid>
</div>

<style>
	.dashboard {
		padding: 2rem;
	}

	:global(.mb-6) {
		margin-bottom: 1.5rem;
	}

	h1 {
		margin-bottom: 2rem;
	}

	.stat {
		font-size: 2rem;
		font-weight: bold;
		margin: 1rem 0;
	}

	.warning {
		color: #da1e28;
	}

	.info {
		color: #0043ce;
	}

	.success {
		color: #24a148;
	}
</style>
