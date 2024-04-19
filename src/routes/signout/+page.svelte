<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const confirmButtonClickHandler = () => {
		if (browser) {
			window.localStorage.removeItem("role")
			goto('/');
		}
	}
</script>
<svelte:head>
	<title>Sign out confirm</title>
	<meta name="description" content="Svelte demo app" />

	
</svelte:head>
<section>
	<h1>Are you sure?</h1>
	<button aria-label="Confirm sign out" on:click={confirmButtonClickHandler}>Yes</button>
</section>
<style>
 	section {
		flex: 1;
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
  }
</style>