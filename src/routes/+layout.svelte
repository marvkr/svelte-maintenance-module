<script lang="ts">
	import '../app.css';
	import 'carbon-components-svelte/css/all.css';
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderUtilities,
		HeaderGlobalAction,
		SideNav,
		SideNavItems,
		SideNavLink,
		Theme,
		SkipToContent,
		Content
	} from 'carbon-components-svelte';
	import { Settings, Light, Dashboard } from 'carbon-icons-svelte';

	let { children } = $props();
	let isSideNavOpen = $state(true);
	let theme = $state<'white' | 'g100'>('white');

	function toggleTheme() {
		theme = theme === 'white' ? 'g100' : 'white';
	}
</script>

<Theme persist persistKey="__carbon-theme" {theme}>
	<Header platformName="Industrial Maintenance" bind:isSideNavOpen>
		<HeaderNav>
			<HeaderNavItem href="/" text="Dashboard" />
			<HeaderNavItem href="/maintenance" text="Maintenance" />
			<HeaderNavItem href="/assets" text="Assets" />
		</HeaderNav>
		<HeaderUtilities>
			<HeaderGlobalAction icon={Settings} />
			<HeaderGlobalAction icon={Light} on:click={toggleTheme} />
		</HeaderUtilities>
	</Header>

	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			<SideNavLink text="Dashboard" href="/" icon={Dashboard} />
			<SideNavLink text="Maintenance Records" href="/maintenance" />
			<SideNavLink text="Asset Management" href="/assets" />
		</SideNavItems>
	</SideNav>

	<Content>
		<SkipToContent />
		{@render children()}
	</Content>
</Theme>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
