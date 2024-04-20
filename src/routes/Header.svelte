<script>
	import { role } from './../lib/stores/roleStore.js';
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store'
	import { onMount } from 'svelte';
	//const storedValue = browser ? window.localStorage.getItem("role") : null;

	// const storedValue = writable(JSON.parse(browser ? localStorage.getItem('role') : null))
	// if (browser)
	// 	storedValue.subscribe((value) => window.localStorage.role = JSON.stringify(value))

	let storedValue;
	role.subscribe((val)=> {
		console.log(val)
		storedValue = val
	})
	
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			{#if (storedValue === 1)}
				<li aria-current={$page.url.pathname === '/users' ? 'page' : undefined}>
					<a href="/users">Users</a>
				</li>
				<li aria-current={$page.url.pathname === '/equipment-all' ? 'page' : undefined}>
					<a href="/equipment-all">All equipment</a>
				</li>
			{/if}
			{#if (storedValue === 2)}
				<li aria-current={$page.url.pathname === '/equipment' ? 'page' : undefined}>
					<a href="/equipment">Equipment</a>
				</li>
			{/if}
			{#if !storedValue}
				<li aria-current={$page.url.pathname === '/signin' ? 'page' : undefined}>
					<a href="/signin">Sign in</a>
				</li>
			{/if}
			{#if storedValue}
				<li aria-current={$page.url.pathname === '/signout' ? 'page' : undefined}>
					<a href="/signout">Sign out</a>
				</li>
			{/if}
		</ul>
	</nav>

	<div class="corner">
		<a href="https://github.com/Calisthetic/svelte-fun">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		--background: rgba(255, 255, 255, 0.7);
		background: var(--background);
		background-size: contain;
		box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.2);
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
