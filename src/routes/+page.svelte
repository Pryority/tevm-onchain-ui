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

      let elementCount = await client.getElementCount();
      console.log("Initial element count:", elementCount);

      if (elementCount === 0) {
        // Try adding a test element if none exist
        await client.addElement(
          "div",
          "Test element added from page",
          ["class", "id"],
          ["page-test-class", "page-test-div"]
        );
      }

      // Add all the new elements
      await client.addElement(
        "dialog",
        `<h2>Onchain Modal</h2>
     <p>This entire modal is stored on chain!</p>
     <button autofocus>Close</button>`,
        ["class", "id"],
        ["onchain-modal", "demo-modal"]
      );

      await client.addElement(
        "form",
        `<input type="text" placeholder="Enter your name">
     <input type="email" placeholder="Enter your email">
     <button type="submit">Submit</button>`,
        ["class", "id", "action"],
        ["onchain-form", "signup-form", "#"]
      );

      await client.addElement(
        "article",
        `<img src="https://place-hold.it/300x200" alt="Card Image">
     <h3>Onchain Card</h3>
     <p>This card component is stored entirely on the blockchain!</p>
     <button>Learn More</button>`,
        ["class", "id"],
        ["onchain-card", "feature-card"]
      );

      await client.addElement(
        "nav",
        `<ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
     </ul>`,
        ["class", "id", "role"],
        ["onchain-nav", "main-nav", "navigation"]
      );

      await client.addElement(
        "div",
        `<svg viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/>
     </svg>`,
        ["class", "id", "role"],
        ["onchain-spinner", "loading-spinner", "status"]
      );

      // Get the final count after adding all elements
      elementCount = await client.getElementCount();
      console.log("Final element count:", elementCount);

      // Now fetch all elements
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
      {@html element.innerHTML}
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

  :global(.onchain-modal) {
    padding: 2rem;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.onchain-form) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    max-width: 400px;
  }

  :global(.onchain-card) {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    max-width: 300px;
  }

  :global(.onchain-nav) {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
  }

  :global(.onchain-nav ul) {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  :global(.onchain-spinner) {
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  :global(button) {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    background: #0066cc;
    color: white;
    cursor: pointer;
  }

  :global(input) {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  :global(.onchain-card img) {
    width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  :global(.onchain-card h3) {
    margin: 0 0 0.5rem 0;
  }

  :global(.onchain-card p) {
    margin: 0 0 1rem 0;
  }

  :global(.onchain-nav a) {
    color: #333;
    text-decoration: none;
    font-weight: 500;
  }

  :global(.onchain-nav a:hover) {
    color: #0066cc;
  }
</style>
