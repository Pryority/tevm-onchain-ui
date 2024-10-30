import type { OnchainUI } from "$lib/OnchainUI";
import { writable } from "svelte/store";

export const uiStore = writable<OnchainUI | null>(null);
