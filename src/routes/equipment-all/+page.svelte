<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
  import { updateEquipment } from '../../lib/stores/updateStore';
  import { apiUrl } from '../../lib/utils/api-context';

  let data

  const getData = async() => {
    if (!browser) {
      return
    }

    try {
      let res = await fetch(apiUrl + "Equipments")
      if (res.ok) 
        data = await res.json()
      else
        throw new Error()
    } catch (err) {
      alert(err.message)
    }
  }
  getData()

  const deleteEquipment = async (id) => {
    if(!confirm('Are you sure?')) {
      return
    }

    await fetch(apiUrl + 'Equipments/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      alert("Deleted successfully")
      // update data
      updateEquipment.set(Math.random())
    })
    .catch(() => {
      alert('Delete failed')
    });
  }
  
  updateEquipment.subscribe(async () => {
    await getData()
  })

</script>

<svelte:head>
  <title>All equipment</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h2>Equipment</h2>
  <div class="container">
    {#await data}
        <p>Loading...</p>
    {:then _}
      {#if (!data)}
        <p>Loading...</p>
      {:else if (data.length === 0)}
        <p>No data...</p>
      {:else}
        {#each data as item (item.id)}
          <div class="eq-container">
            <img src={apiUrl + item.image} width={200} alt={item.name}>
            <div class="info">
              <p class="price">{item.price} руб.</p>
              <p>{item.name}</p>
              <p>{item.number}</p>
              <p>{item.equipmentStatus}</p>
              {#if item.audience !== null}
                <p>{item.audience.shifr + (item.audience.name ? " / " + item.audience.name : '')}</p>
              {/if}
            </div>
            <div class="buttons">
              <button on:click={() => goto("/equipment/edit/" + item.id)} class="btn-edit">Редактировать</button>
              <button on:click={() => deleteEquipment(item.id)}>Удалить</button>
            </div>
          </div>
        {/each}
      {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
  </div>
  <button class="add-btn" on:click={() => {goto("/equipment-all/add")}}>Добавить</button>
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

  button {
    margin-top: 20px;
    padding: 8px 16px;
    font-size: 16px;
  }

  .container {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .eq-container {
    transition: all .25s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border-radius: 8px;
    border: 2px solid var(--color-grey);
    margin-top: 6px;
    margin: 6px 12px;
    padding: 8px;
    width: 266px;
  }
  .eq-container .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-wrap: balance;
  }
  .price {
    position: absolute;
    top: 4px;
    left: 4px;
    padding: 2px 4px;
    background-color: white;
    color: var(--color-blue);
    border-radius: 8px;
    font-weight: 600;
  }

  .buttons {
    display: flex;
    justify-content: space-around;
  }

  .btn-edit:hover {
    border: 2px solid var(--color-blue);
  }

  .btn-edit {
    margin-right: 8px;
  }

  p {margin: 0px;}

  .add-btn {margin-bottom: 16px;}
</style>