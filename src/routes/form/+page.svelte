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
    const allElements: UIElement[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const element = await ui.getElement(i);
        if (element.exists) {
          const attributes: Record<string, string> = {};
          // Fetch common attributes
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

          allElements.push({
            id: i,
            tagName: element.tagName,
            innerHTML: element.innerHTML,
            attributes,
            childElements: [], // We'll populate this next
          });
        }
      } catch (elementError) {
        console.error(`Error fetching element ${i}:`, elementError);
      }
    }

    // Now fetch child elements
    for (const element of allElements) {
      try {
        // Add child elements logic here if needed
        console.log(`Element ${element.id}:`, element);
      } catch (error) {
        console.error(`Error processing element ${element.id}:`, error);
      }
    }

    return allElements;
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
      // Create a form template
      await ui.createTemplate(
        "signupForm",
        "form",
        `<h2>Sign Up</h2>
         <div class="form-group"></div>
         <div class="button-group"></div>`,
        ["class", "id"],
        ["onchain-form", "signup-form"]
      );

      // Create the main form
      const formId = await ui.addElement(
        "form",
        "", // Empty innerHTML as we'll add child elements
        ["class", "id", "data-state"],
        ["signup-form", "main-form", "initial"]
      );

      // Add form fields as child elements
      const emailFieldId = await ui.addElement(
        "div",
        `<label for="email">Email</label>
         <input type="email" id="email" placeholder="Enter your email">
         <span class="error-message"></span>`,
        ["class"],
        ["form-group"]
      );

      const passwordFieldId = await ui.addElement(
        "div",
        `<label for="password">Password</label>
         <input type="password" id="password" placeholder="Choose a password">
         <span class="error-message"></span>`,
        ["class"],
        ["form-group"]
      );

      const submitButtonId = await ui.addElement(
        "button",
        "Sign Up",
        ["type", "class"],
        ["submit", "submit-button"]
      );

      // Add child elements to form
      await ui.addChildElement(formId, emailFieldId);
      await ui.addChildElement(formId, passwordFieldId);
      await ui.addChildElement(formId, submitButtonId);

      // Add styles
      await ui.addStyle(
        formId,
        ".signup-form",
        ["display", "gap", "padding", "max-width", "margin"],
        ["flex", "1rem", "2rem", "400px", "0 auto"]
      );

      await ui.addStyle(
        formId,
        ".form-group",
        ["display", "flex", "flex-direction"],
        ["flex", "1", "column"]
      );

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

      // Set form layout
      await ui.setLayout(
        formId,
        LAYOUT_TYPE_MAP.Flex,
        ["direction", "align", "justify"],
        ["column", "stretch", "start"]
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
        {@html element.innerHTML}
      </svelte:element>
    {/each}
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: #333;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .test-class {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #4a4a4a;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 0.9rem;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s;
  }

  input[type="email"]:focus,
  input[type="password"]:focus {
    border-color: #007bff;
    outline: none;
  }

  .error-message {
    color: #d9534f;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .submit-button:hover {
    background-color: #0056b3;
  }
</style>
