<script lang="ts">
	import {
		Modal,
		TextInput,
		Select,
		SelectItem,
		TextArea,
		DatePicker,
		DatePickerInput,
		NumberInput,
		ComboBox,
		Tag
	} from 'carbon-components-svelte';
	import type { MaintenanceRecord } from '$lib/server/db/schema';

	let {
		open = $bindable(false),
		record = {} as Partial<MaintenanceRecord>,
		onSubmit,
		onClose
	} = $props<{
		open: boolean;
		record: Partial<MaintenanceRecord>;
		onSubmit: (data: Partial<MaintenanceRecord>) => void;
		onClose: () => void;
	}>();

	const assetTypes = [
		{ id: 'Machinery', text: 'Machinery' },
		{ id: 'HVAC', text: 'HVAC' },
		{ id: 'Electrical', text: 'Electrical' },
		{ id: 'Plumbing', text: 'Plumbing' },
		{ id: 'Safety Equipment', text: 'Safety Equipment' },
		{ id: 'Production Line', text: 'Production Line' }
	];

	let formData = $state({
		title: '',
		description: '',
		status: 'pending',
		priority: 'low',
		assetType: '',
		location: '',
		estimatedHours: 1,
		scheduledDate: '',
		assignedTechnician: ''
	});

	$effect(() => {
		// Update form data when record changes
		formData = {
			title: record.title || '',
			description: record.description || '',
			status: record.status || 'pending',
			priority: record.priority || 'low',
			assetType: record.assetType || '',
			location: record.location || '',
			estimatedHours: record.estimatedHours || 1,
			scheduledDate: record.scheduledDate || '',
			assignedTechnician: record.assignedTechnician || ''
		};
	});

	function handleSubmit() {
		onSubmit({ ...record, ...formData });
		onClose();
	}
</script>

<Modal
	bind:open
	modalHeading={record.id ? 'Edit Maintenance Record' : 'New Maintenance Record'}
	primaryButtonText={record.id ? 'Update' : 'Create'}
	secondaryButtonText="Cancel"
	on:click:button--secondary={onClose}
	on:submit={handleSubmit}
	size="lg"
>
	<div class="form-grid">
		<TextInput labelText="Title" placeholder="Enter title" bind:value={formData.title} required />

		<ComboBox
			titleText="Asset Type"
			placeholder="Select asset type"
			items={assetTypes}
			bind:selectedId={formData.assetType}
		/>

		<TextInput
			labelText="Location"
			placeholder="Enter location"
			bind:value={formData.location}
			required
		/>

		<NumberInput label="Estimated Hours" min={1} max={168} bind:value={formData.estimatedHours} />

		<Select labelText="Status" bind:selected={formData.status}>
			<SelectItem value="pending" text="Pending" />
			<SelectItem value="in-progress" text="In Progress" />
			<SelectItem value="completed" text="Completed" />
		</Select>

		<Select labelText="Priority" bind:selected={formData.priority}>
			<SelectItem value="low" text="Low" />
			<SelectItem value="medium" text="Medium" />
			<SelectItem value="high" text="High" />
		</Select>

		<DatePicker dateFormat="m/d/Y">
			<DatePickerInput
				labelText="Scheduled Date"
				placeholder="mm/dd/yyyy"
				bind:value={formData.scheduledDate}
			/>
		</DatePicker>

		<TextInput
			labelText="Assigned Technician"
			placeholder="Enter technician name"
			bind:value={formData.assignedTechnician}
		/>

		<div class="full-width">
			<TextArea
				labelText="Description"
				placeholder="Enter description"
				bind:value={formData.description}
				required
				rows={4}
			/>
		</div>
	</div>
</Modal>

<style>
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
	}

	.full-width {
		grid-column: 1 / -1;
	}
</style>
