<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
  import { apiUrl } from '../../../../lib/utils/api-context';
  import { onMount } from 'svelte';

  export let data

  let name = ''
  let price = ''
  let number = ''
  let selectedAudience
  let selectedStatus
  let selectedUser

  let audiencesToBeShown
  let statusesToBeShown
  let usersToBeShown
  $: {
    if (currentEquipment) {
      name = currentEquipment.name
      price = currentEquipment.price
      number = currentEquipment.number
      selectedAudience = (currentEquipment.audienceId ?? 0)
      selectedStatus = currentEquipment.equipmentStatusId
      selectedUser = currentEquipment.userId
      console.log(currentEquipment.userId)
    }

    audiencesToBeShown = audiences
    statusesToBeShown = statuses
    usersToBeShown = users
  }
  
  let audiences = []

  const getAudiences = async () => {
    try {
      let response = await fetch(apiUrl + "Audiences");
      audiences = await response.json();
    } catch(err) {
      console.log(err);
    }
  }
  
  let statuses = []

  const getStatuses = async () => {
    try {
      let response = await fetch(apiUrl + "EquipmentStatus");
      statuses = await response.json();
    } catch(err) {
      console.log(err);
    }
  }
  
  let users = []

  const getUsers = async () => {
    try {
      let response = await fetch(apiUrl + "Users?roleId=2");
      users = await response.json();
    } catch(err) {
      console.log(err);
    }
  }

  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    if (!selectedStatus || !browser) {
      alert("Something went wrong")
      return
    }
    // Send a request to the server for authentication
    await fetch(apiUrl + 'Equipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        audienceId: selectedAudience === 0 ? null : selectedAudience,
        userId: window.localStorage.getItem("id"),
        number,
        equipmentStatusId: selectedStatus,
        price
      }),
    })
    .then((res) => {
      if (res.status !== 201)
        throw new Error("Wrong data format")
      alert("Оборудование успешно добавлено!")
      goto("/equipment")
    })
    .catch((ex) => {
      alert(ex.message)
    });
  }

  let currentEquipment
  onMount(async() => {
    await fetch(apiUrl + "Equipments/" + data.id)
    .then(x => x.json())
    .then(data => currentEquipment = data)
    .catch((ex) => {
      alert(ex.message)
    })
  })
</script>

<svelte:head>
  <title>Add equipment</title>
</svelte:head>

<section>
  <h2>Добавьте информацию</h2>
  <form on:submit={handleSubmit}>
    <label for="name">Name:</label>
    <input id="name" type="text" bind:value={name} required />
   
    <label for="number">Number:</label>
    <input id="number" type="number" bind:value={number} required />
   
    <label for="price">Price:</label>
    <input id="price" type="number" bind:value={price} required />

    <label for="select-audience" class="form-label">Audience</label>
    <select id="select-audience" bind:value={selectedAudience} class="from-select">
      <option value="" disabled>-- Выберите аудиторию --</option>
      {#await getAudiences()}
        <option value="0" disabled>...waiting</option>
      {:then _}
        <option value={0}>Не выбрано</option>
        {#each audiencesToBeShown as item (item.id)}
          <option value={item.id}>{item.shifr + (item.name ? " / " + item.name : '')}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>

    <label for="select-status" class="form-label">Status</label>
    <select id="select-status" bind:value={selectedStatus} class="from-select">
      <option value="" disabled>-- Выберите статус --</option>
      {#await getStatuses()}
        <option value="0" disabled>...waiting</option>
      {:then _}
        {#each statusesToBeShown as item (item.id)}
          <option value={item.id} selected={currentEquipment ? (currentEquipment.statusId === item.id ? true : false) : false}>{item.name}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>

    <label for="select-user" class="form-label">User</label>
    <select id="select-user" bind:value={selectedUser} class="from-select">
      <option value="" disabled>-- Выберите пользователя --</option>
      {#await getUsers()}
        <option value="0" disabled>...waiting</option>
      {:then _}
        <option value={0}>Не выбран</option>
        {#each usersToBeShown as item (item.id)}
          <option value={item.id} selected={currentEquipment ? (currentEquipment.userId === item.id ? true : false) : false}>{item.secondName + " " + item.firstName + " " + item.thirdName}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>
   
    <button type="submit">Let's gooo</button>
    <button type="button" on:click={() => goto("/equipment")}>Back</button>
   </form>
</section>

<style>
  
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

  h2 {
    font-weight: 600;
    font-size: 24px;
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
  input[type=text], input[type=number], select {
    border-radius: 4px;
    border: 2px ridge var(--color-grey);
  }
</style>