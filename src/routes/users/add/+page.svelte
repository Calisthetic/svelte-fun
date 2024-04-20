<script>
	import { role } from './../../../lib/stores/roleStore.js';
	import { apiUrl } from './../../../lib/utils/api-context.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

  let login = '';
  let password = '';
  let fio = ''
  let email = ''
  let phoneNumber = ''
  let selectedRole
  
  let roles = []
  $: rolesToBeShown = roles

  const getRoles = async () => {
    try {
      let response = await fetch(apiUrl + "Roles");
      roles = await response.json();
      selectedRole = roles[0].id
    } catch(err) {
      console.log(err);
    }
  }

  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    if (fio.split(' ').length !== 3 || !selectedRole) {
      alert("Entry full name pls")
      return
    }
    // Send a request to the server for authentication
    await fetch(apiUrl + 'Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: fio.split(' ')[1],
        secondName: fio.split(' ')[0],
        thirdName: fio.split(' ')[2],
        login, 
        password,
        email,
        phoneNumber: phoneNumber.toString(),
        roleId: selectedRole
      }),
    })
    .then((res) => {
      if (res.status !== 201)
        throw new Error("Wrong data format")
      alert("Пользователь успешно создан!")
      goto("/users")
    })
    .catch((ex) => {
      alert(ex.message)
    });
  }
</script>

<svelte:head>
	<title>Add new user</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h2>Добавьте нового пользовтаеля</h2>
	<form on:submit={handleSubmit}>
    <label for="login">Login:</label>
    <input id="login" type="text" bind:value={login} required />
   
    <label for="password">Password:</label>
    <input id="password" type="password" bind:value={password} required />
   
    <label for="fio">Full name:</label>
    <input id="fio" type="text" bind:value={fio} required />
   
    <label for="email">Email:</label>
    <input id="email" type="text" bind:value={email}/>
   
    <label for="phoneNumber">Phone number:</label>
    <input id="phoneNumber" type="number" bind:value={phoneNumber}/>

    <label for="select-roles" class="form-label">Status</label>

    <select id="select-roles" bind:value={selectedRole} class="from-select">
      <option value="" disabled>-- Выберите роль --</option>
      {#await getRoles()}
        <option value="0" disabled>...waiting</option>
      {:then _}
        {#each rolesToBeShown as item (item.id)}
          <option value={item.id}>{item.name}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>
   
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
    min-width: 280px;
  }
  form button {
    margin-top: 16px;
  }
  form label {
    margin-top: 8px;
    margin-bottom: 4px;
  }
  input[type=text], input[type=password], input[type=number], select {
    border-radius: 4px;
    border: 2px ridge var(--color-grey);
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
  }
</style>