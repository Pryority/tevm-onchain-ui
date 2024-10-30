import type { HTMLStoreClient } from "$lib/HTMLStoreClient";
import { writable } from "svelte/store";

export const htmlStoreClient = writable<HTMLStoreClient | null>(null);
