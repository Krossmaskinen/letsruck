<script>
	import { createEventDispatcher } from "svelte";
  import Map from "./Map.svelte";

	export let event;

	const dispatch = createEventDispatcher();
	const coords = event.location.split(",");
	const address = event.address;
</script>

<article>
	<h2>
		{event.title} <button on:click={() => dispatch("edit")}>E</button> <button on:click={() => {dispatch("remove")}}>X</button>
	</h2>
	<div>
		{event.date}
	</div>
	<div>
    <Map {coords} {address} />
	</div>
</article>

<style>
  article {
    width: 100%;
		padding: 10px;
		box-shadow: 1px 1px 3px rgba(0,0,0,0.2);

		transition: transform 100ms ease-out;
	}
	article:hover {
		box-shadow: 1px 1px, 5px rgba(0,0,0,0.2);
	}
</style>