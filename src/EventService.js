import { get } from "svelte/store";
import { events } from "./events";

function EventServiceConstructor() {
  function saveEvent(event) {
    const eventList = get(events);

    console.log("eventlist before saving", eventList);
    if (event.id) {
      const removeIndex = eventList.findIndex(e => e.id === event.id);
      eventList.splice(removeIndex, 1, event);
    } else {
      const id = (Math.random() * 10);
      eventList.push({...event, id});
    }

    events.set(eventList);
    console.table(eventList);
    storeEvents(eventList);
  }


  function removeEvent(id) {
    const eventList = get(events);
		const index = eventList.findIndex(e => e.id === id);

    if (index !== -1) {
      eventList.splice(index, 1);
      events.set(eventList);

      storeEvents();
    }

    console.log(`event removed ${id}`);
    console.log(eventList);
	}

  function storeEvents() {
    const eventList = get(events);

    const stringEvents = JSON.stringify(eventList);
    console.log(stringEvents);
    localStorage["events"] = JSON.stringify(eventList);
  }

  return {
    saveEvent,
    removeEvent,
  }
}

export const EventService = EventServiceConstructor();