<script lang="ts">
</script>

<h1 class="text-4xl font-bold text-gray-900 text-center mb-8">
  Onchain UI Components
</h1>

<section class="mb-12">
  <p class="text-xl text-gray-600 leading-relaxed">
    A proof-of-concept for storing UI components entirely on-chain using Tevm
    and Solidity. This project demonstrates how to store and render HTML
    components with Tailwind classes directly from the blockchain.
  </p>
</section>

<section class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-900 mb-6">How it Works</h2>
  <ul class="space-y-4">
    <li class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p class="ml-3 text-lg text-gray-600">
        <strong class="text-blue-600 font-medium"
          >Smart Contract Storage:</strong
        >
        UI components and their Tailwind classes are stored in a Solidity contract.
      </p>
    </li>
    <li class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p class="ml-3 text-lg text-gray-600">
        <strong class="text-blue-600 font-medium">Local Development:</strong>
        Uses Tevm for local blockchain simulation and Anvil for development.
      </p>
    </li>
    <li class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p class="ml-3 text-lg text-gray-600">
        <strong class="text-blue-600 font-medium">Component Management:</strong>
        Supports nested elements, event handlers, and state management.
      </p>
    </li>
    <li class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p class="ml-3 text-lg text-gray-600">
        <strong class="text-blue-600 font-medium">Tailwind Integration:</strong>
        All styles are stored as Tailwind classes in the smart contract.
      </p>
    </li>
  </ul>
</section>

<section class="bg-gray-50 rounded-xl p-8 text-center">
  <h2 class="text-3xl font-semibold text-gray-900 mb-4">Live Demo</h2>
  <p class="text-xl text-gray-600 mb-6">
    Check out our onchain form component demo. Every element and its Tailwind
    classes are stored and managed through smart contracts.
  </p>
  <a
    href="/form"
    class="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
  >
    View Form Demo
    <svg
      class="ml-2 -mr-1 w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </a>
</section>
