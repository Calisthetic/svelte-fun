<script>
	import { role } from './../../lib/stores/roleStore.js';
	import { apiUrl } from './../../lib/utils/api-context.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

  let login = '';
  let password = '';

  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Send a request to the server for authentication
    await fetch(apiUrl + 'Users/SignIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      if (!browser) {
        throw new Error("fufel")
      }
      window.localStorage.setItem("role", data.role)
      role.set(data.role === "Админ" ? 1 : 2)
		  goto(data.role === "Админ" ? '/users' : '/equipment');
    })
    .catch(() => {
      // Handle login failure
      console.error('Login failed');
      // Show error message
      alert('Login failed')
    });
  }
</script>

<svelte:head>
	<title>Sign in</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<form on:submit={handleSubmit}>
    <label for="login">Login:</label>
    <input id="login" type="text" bind:value={login} required />
   
    <label for="password">Password:</label>
    <input id="password" type="password" bind:value={password} required />
   
    <button type="submit">Let's gooo</button>
   </form>
</section>
<style>
 	section {
		flex: 1;
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  form button {
    margin-top: 16px;
  }
  form label {
    margin-top: 8px;
    margin-bottom: 4px;
  }
  input[type=text], input[type=password] {
    border-radius: 4px;
    border: 2px ridge var(--color-grey);
  }
</style>