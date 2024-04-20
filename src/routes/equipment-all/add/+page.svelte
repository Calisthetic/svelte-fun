<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
  import { apiUrl } from '../../../lib/utils/api-context';

  let name = ''
  let price = ''
  let number = ''
  let image
  let selectedAudience
  let selectedStatus
  let selectedUser
  
  let audiences = []
  $: audiencesToBeShown = audiences

  const getAudiences = async () => {
    try {
      let response = await fetch(apiUrl + "Audiences");
      audiences = await response.json();
      selectedAudience = 0
    } catch(err) {
      console.log(err);
    }
  }
  
  let statuses = []
  $: statusesToBeShown = statuses

  const getStatuses = async () => {
    try {
      let response = await fetch(apiUrl + "EquipmentStatus");
      statuses = await response.json();
      selectedStatus = statuses[0].id
    } catch(err) {
      console.log(err);
    }
  }
  
  let users = []
  $: usersToBeShown = users

  const getUsers = async () => {
    try {
      let response = await fetch(apiUrl + "Users?roleId=2");
      users = await response.json();
      selectedUser = users[0].id
    } catch(err) {
      console.log(err);
    }
  }

  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    if (!selectedStatus || !browser || image.length !== 1) {
      alert("Something went wrong")
      return
    }

    const formData = new FormData()
    formData.append('Name', name)
    if (selectedAudience !== 0)
      formData.append('audienceId', selectedAudience)
    formData.append('userId', selectedUser)
    formData.append('number', number)
    formData.append('equipmentStatusId', selectedStatus)
    formData.append('price', price)
    formData.append('image', image[0])

    // Send a request to the server for authentication
    await fetch(apiUrl + 'Equipments', {
      method: 'POST',
      body: formData,
    })
    .then((res) => {
      if (res.status !== 201)
        throw new Error("Wrong data format")
      alert("Оборудование успешно добавлено!")
      goto("/equipment-all")
    })
    .catch((ex) => {
      alert(ex.message)
    });
  }
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
          <option value={item.id}>{item.shifr + " / " + item.name}</option>
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
          <option value={item.id}>{item.name}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>

    <label for="select-user" class="form-label">User</label>
    <select id="select-user" bind:value={selectedUser} class="from-select">
      <option value="" disabled>-- Выберите статус --</option>
      {#await getUsers()}
        <option value="0" disabled>...waiting</option>
      {:then _}
        {#each usersToBeShown as item (item.id)}
          <option value={item.id}>{item.secondName + " " + item.firstName + " " + item.thirdName}</option>
        {/each}
      {:catch error}
        <option value="0" disabled>Server error...</option>
      {/await}
    </select>
    
    <label for="image">Выберите картинку</label>
    <input type="file" id="image" name="image" bind:files={image} accept="image/jpeg, image/png">
   
    <button type="submit">Let's gooo</button>
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