import { writable } from "svelte/store";
import type { MemoryClient } from "tevm";

export const memoryClientStore = writable<MemoryClient | null>(null);
