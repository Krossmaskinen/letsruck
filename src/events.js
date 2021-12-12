import { writable } from "svelte/store";

let storedEvents = localStorage["events"];

storedEvents = storedEvents ? JSON.parse(storedEvents) : [];

export const events = writable(storedEvents);