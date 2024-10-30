<script lang="ts">
  import { HTMLStoreClient } from "$lib/HTMLStoreClient";
  import type { HTMLElementData } from "$lib/HTMLStoreClient";
  import { onMount } from "svelte";
  import { htmlStoreClient } from "../stores/htmlStoreClient";

  interface HTMLElementWithAttributes extends HTMLElementData {
    attributes: Record<string, string>;
  }

  let htmlElements: HTMLElementWithAttributes[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    // Initialize the client
    const client = new HTMLStoreClient("dev");
    htmlStoreClient.set(client);

    try {
      // Wait for both deployment and initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const elementCount = await client.getElementCount();
      console.log("Element count:", elementCount);

      if (elementCount === 0) {
        // Try adding a test element if none exist
        await client.addElement(
          "div",
          "Test element added from page",
          ["class", "id"],
          ["page-test-class", "page-test-div"]
        );

        // Get the updated count
        const newCount = await client.getElementCount();
        console.log("New element count:", newCount);
      }

      // Fetch all elements
      for (let i = 0; i < elementCount; i++) {
        try {
          const element = await client.getElement(i);
          console.log(`Element ${i}:`, element);

          if (element.exists) {
            const id = await client.getAttribute(i, "id");
            const className = await client.getAttribute(i, "class");
            console.log(`Element ${i} attributes:`, { id, className });

            htmlElements = [
              ...htmlElements,
              {
                ...element,
                attributes: {
                  id: id || `element-${i}`,
                  class: className || "",
                },
              },
            ];
          }
        } catch (elementError) {
          console.error(`Error loading element ${i}:`, elementError);
        }
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "An error occurred";
      console.error("Error loading HTML elements:", e);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div>
    Loading elements... Please wait while the contract is being deployed.
  </div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else if htmlElements.length === 0}
  <div>No HTML elements found in the contract.</div>
{:else}
  {#each htmlElements as element (element.attributes.id)}
    <svelte:element this={element.tagName} {...element.attributes}>
      {element.innerHTML}
    </svelte:element>
  {/each}
{/if}

<style>
  .error {
    color: red;
    padding: 1rem;
    border: 1px solid red;
    border-radius: 4px;
    margin: 1rem 0;
  }
</style>
