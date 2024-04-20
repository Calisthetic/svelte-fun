<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
  import { apiUrl } from '../../../lib/utils/api-context';

  let name = ''
  let price = ''
  let number = ''
  let selectedAudience
  let selectedStatus
  
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