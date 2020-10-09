<script>
	import EditEvent from './EditEvent.svelte';
	import Event from './Event.svelte';
	import events from './events';

	let title = `Let's ruck!`;
	let isEditingEvent = false;
	let eventList = [...events];
	let eventBeingEdited;

	function toggleEventForm() {
		isEditingEvent = !isEditingEvent;
	}

	function saveEvent(event) {
		if (event.id) {
			const removeIndex = eventList.findIndex(e => e.id === event.id);
			eventList.splice(removeIndex, 1, event);
		} else {
			const id = (Math.random() * 10);
			eventList.push({...event, id});
		}

		eventList = [...eventList];
		console.table(eventList);
		storeEvents();
	}

	function removeEvent(id) {
		const index = eventList.indexOf(e => e.id === id);
		eventList.splice(index, 1);
		eventList = [...eventList];

		storeEvents();
	}

	function editEvent(id) {
		eventBeingEdited = eventList.find(e => e.id === id);
		console.log("edit event", eventBeingEdited);
		toggleEventForm();
	}

	function handleEventSaved(event) {
		toggleEventForm();
		saveEvent(event.detail);
	}

	function handleCancelEdit() {
		eventBeingEdited = null;
		toggleEventForm();
	}

	function storeEvents() {
		localStorage["events"] = JSON.stringify(eventList);
	}
</script>

<main>
	<h1>{title}</h1>

	{#if !isEditingEvent}
		<button on:click={() => toggleEventForm()}>Add event</button>

		<ul>
			{#each eventList as event (event.id)}
				<li>
					<Event
						bind:event={event}
						on:remove={() => {removeEvent(event.id);}}
						on:edit={() => {editEvent(event.id);}}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<EditEvent
			on:save={handleEventSaved}
			on:cancel={handleCancelEdit}
			{...eventBeingEdited}
		/>
	{/if}
</main>

<style>
	h1 {
		color: tomato;
		-webkit-text-stroke-width: 1px;
  	-webkit-text-stroke-color: black;
	}

	main {
		margin: 20px;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));

		width: 100%;

		padding-left: 0;
		list-style: none;
	}

	li:not(:last-child) {
		margin-bottom: 10px;
	}
</style>