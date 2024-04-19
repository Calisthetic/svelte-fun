<script>
	import { updateUsers } from './../../lib/stores/updateStore.js';
  import { apiUrl } from "../../lib/utils/api-context";

  export let id
  export let firstName
  export let secondName
  export let thirdName
  export let login
  export let password
  export let email
  export let phoneNumber
  export let equipmentCount
  export let role

  const deleteUser = async () => {
    if(!confirm('Are you sure?')) {
      return
    }

    await fetch(apiUrl + 'Users/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      alert("Deleted successfully")
      // update data
      updateUsers.set(Math.random())
    })
    .catch(() => {
      alert('Delete failed')
    });
  }
</script>

<tr>
  <td>{id}</td>
  <td>{secondName + " " + firstName + " " + thirdName}</td>
  <td data-role={role}><span>{role}</span></td>
  <td>{equipmentCount === 0 ? "-" : equipmentCount}</td>
  <td>{email ?? "-"}</td>
  <td>{phoneNumber ?? "-"}</td>
  <td><button on:click={deleteUser}>Удалить</button></td>
</tr>

<style>
  td {
    padding: 8px 6px;
  }
  tr {
    border-bottom: 1px solid var(--color-grey);
  }
  td[data-role=Админ] > span {
    border-radius: 50px;
    background-color: var(--color-red);
    width: min-content;
    padding: 2px 8px;
  }
  td[data-role=Пользователь] > span {
    border-radius: 50px;
    background-color: var(--color-blue);
    width: min-content;
    padding: 2px 8px;
  }

  button {
    font-size: 16px;
  }
</style>