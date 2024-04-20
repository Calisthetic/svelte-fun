<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const buttonClickHandler = () => {
		goto("signin")
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		Welcome to this<br />SvelteKit app
	</h1>
	<button on:click={buttonClickHandler}>Sign in</button>

</section>

<style>
	
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
