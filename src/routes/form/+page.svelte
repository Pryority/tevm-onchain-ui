<script lang="ts">
  import { OnchainUI } from "$lib/OnchainUI";
  import { uiStore } from "$lib/stores/uiStore";
  import { LAYOUT_TYPE_MAP } from "$lib/types";
  import { onMount } from "svelte";

  interface UIElement {
    id: number;
    tagName: string;
    innerHTML: string;
    attributes: Record<string, string>;
    childElements: number[];
    children?: UIElement[];
  }

  let elements: UIElement[] = [];
  let loading = true;
  let error: string | null = null;

  function stringToHex(str: string): string {
    return Array.from(new TextEncoder().encode(str))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function fetchAllElements(ui: OnchainUI) {
    const count = await ui.getElementCount();
    const allElements: Record<number, UIElement> = {};
    const rootElements: UIElement[] = [];

    // First pass: create all elements
    for (let i = 0; i < count; i++) {
      try {
        const element = await ui.getElement(i);
        if (element.exists) {
          const attributes: Record<string, string> = {};
          try {
            const id = await ui.getAttribute(i, "id");
            const className = await ui.getAttribute(i, "class");
            if (id) attributes.id = id;
            if (className) attributes.class = className;
          } catch (attrError) {
            console.warn(
              `Error fetching attributes for element ${i}:`,
              attrError
            );
          }

          allElements[i] = {
            id: i,
            tagName: element.tagName,
            innerHTML: element.innerHTML,
            attributes,
            childElements: [],
            children: [],
          };
        }
      } catch (elementError) {
        console.error(`Error fetching element ${i}:`, elementError);
      }
    }

    // Second pass: build the tree structure
    for (const element of Object.values(allElements)) {
      try {
        const childIds = await ui.getChildElements(element.id);
        element.childElements = childIds;

        // Add actual child elements
        element.children = childIds
          .map((id) => allElements[id])
          .filter(Boolean);

        // If this element has no parent, it's a root element
        const parentId = await ui.getParentId(element.id);
        if (parentId === 0 || !allElements[parentId]) {
          rootElements.push(element);
        }
      } catch (error) {
        console.error(`Error processing element ${element.id}:`, error);
      }
    }

    return rootElements;
  }

  // function renderElement(element: UIElement): string {
  //   const attrs = Object.entries(element.attributes)
  //     .map(([key, value]) => `${key}="${value}"`)
  //     .join(" ");

  //   return `<${element.tagName} ${attrs}>${element.innerHTML}</${element.tagName}>`;
  // }

  onMount(async () => {
    const ui = new OnchainUI("dev");
    uiStore.set(ui);

    try {
      // Create the main form with Tailwind classes
      const formId = await ui.addElement(
        "form",
        "", // Empty innerHTML as we'll add child elements
        ["class"],
        ["max-w-md mx-auto mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"]
      );

      // Add form title
      const titleId = await ui.addElement(
        "h2",
        "Sign Up",
        ["class"],
        ["text-2xl font-bold text-gray-900 text-center mb-8"]
      );

      // Add email field with Tailwind classes
      const emailFieldId = await ui.addElement(
        "div",
        `<label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
         <input type="email" id="email" placeholder="Enter your email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
         <span class="mt-1 text-sm text-red-600"></span>`,
        ["class"],
        ["space-y-1"]
      );

      // Add password field with Tailwind classes
      const passwordFieldId = await ui.addElement(
        "div",
        `<label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
         <input type="password" id="password" placeholder="Choose a password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
         <span class="mt-1 text-sm text-red-600"></span>`,
        ["class"],
        ["space-y-1"]
      );

      // Add submit button with Tailwind classes
      const submitButtonId = await ui.addElement(
        "button",
        "Sign Up",
        ["type", "class"],
        [
          "submit",
          "w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200",
        ]
      );

      // Add child elements to form
      await ui.addChildElement(formId, titleId);
      await ui.addChildElement(formId, emailFieldId);
      await ui.addChildElement(formId, passwordFieldId);
      await ui.addChildElement(formId, submitButtonId);

      // Add event handlers
      await ui.addEventHandler(
        submitButtonId,
        "click",
        "validateForm",
        `0x${stringToHex(
          JSON.stringify({
            requiredFields: ["email", "password"],
            validations: {
              email: "^[^@]+@[^@]+\\.[^@]+$",
              password: "^.{8,}$",
            },
          })
        )}`
      );

      // Initialize state
      await ui.updateState(
        "formData",
        `0x${stringToHex(
          JSON.stringify({
            email: "",
            password: "",
            errors: {},
            isSubmitting: false,
          })
        )}`
      );

      // Fetch and render all elements
      elements = await fetchAllElements(ui);
      console.log("All elements:", elements);
    } catch (e) {
      error = e instanceof Error ? e.message : "An error occurred";
      console.error("Error creating form:", e);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div>Loading form... Please wait while the contract is being deployed.</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else}
  <div class="form-container">
    {#each elements as element (element.id)}
      <svelte:element this={element.tagName} {...element.attributes}>
        {#if element.children?.length}
          {#each element.children as child (child.id)}
            <svelte:element this={child.tagName} {...child.attributes}>
              {@html child.innerHTML}
            </svelte:element>
          {/each}
        {:else}
          {@html element.innerHTML}
        {/if}
      </svelte:element>
    {/each}
  </div>
{/if}
