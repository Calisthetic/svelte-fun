import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const role = writable(null)

if (browser) {
  const val = window.localStorage.getItem("role")
  role.set(parseInt(val) ?? null)
}