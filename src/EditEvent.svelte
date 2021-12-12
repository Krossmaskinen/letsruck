<script>
  import { createEventDispatcher } from "svelte";
  import Map from "./Map.svelte";

  export let title = "";
  export let date = new Date();
  export let coords = [59.28533911776481, 18.105468750000004];
  export let id = "";
  export let address = "";
  let clickedPosition = [];

  const dispatch = createEventDispatcher();

  function createEvent() {
    date = new Date(date);
    dispatch("save", {
      id,
      title,
      location: clickedPosition.toString().replace(" ", ""),
      address,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${
        date.getDate() + 1
      }`,
    });
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      cancelEditFlow();
    }
  }

  function cancelEditFlow() {
    dispatch("cancel");
  }

  $: console.log("address: ", address);
</script>

<svelte:window on:keydown={handleKeydown} />

<section>
  <form on:submit={createEvent}>
    <div>
      <label for="title">Title</label>
      <input type="text" bind:value={title} />
    </div>
    <div>
      <label for="date">Date</label>
      <input type="date" name="date" bind:value={date} />
    </div>
    <div>
      <Map {coords} bind:address isEditable bind:clickedPosition />
    </div>
    <button>Save</button>
  </form>
  <button on:click={cancelEditFlow}>Cancel</button>
</section>
