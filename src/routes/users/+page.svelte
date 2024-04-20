<script>
	import { goto } from '$app/navigation';
	import { apiUrl } from './../../lib/utils/api-context.js';
  import User from './User.svelte';
  import { updateUsers } from '../../lib/stores/updateStore.js';

  let data = []
  $: dataToBeShown = data

  const getData = async () => {
    try {
      let response = await fetch(apiUrl + "Users");
      data = await response.json();
    } catch(err) {
      alert(err.message);
    }
  }
  updateUsers.subscribe(async () => {
    await getData()
  })
</script>

<svelte:head>
	<title>Users</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h2>Таблица с пользователями</h2>
	{#await getData()}
    <p>...waiting</p>
  {:then _}
    {#if (dataToBeShown.length === 0)}
      <p>Данных нет, сори</p>
    {:else}
      <div class="container">
        <table border="0">
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Роль</th>
            <th>Оборудование</th>
            <th>Почта</th>
            <th>Телефон</th>
            <th>Не надо, дядя</th>
          </tr>
          {#each dataToBeShown as item (item.id)}
            <User {...item} />
          {/each}
        </table>
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  <button on:click={() => goto("/users/add")}>Добавить пользователя?</button>
</section>

<style>
	
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

  table {
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
  }
  tr {
    background-color: var(--color-grey);
    border-radius: 4px 4px 0px 0px;
  }
  th {
    text-align: left;
    padding: 6px 4px;
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
  
</style>
