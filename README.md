# Onchain UI Components

A proof-of-concept for storing UI components entirely on-chain using Tevm and Solidity.

## Overview

This project demonstrates how to store and render HTML components directly from the blockchain. It uses:

- Tevm for local blockchain simulation
- Solidity for smart contract storage
- SvelteKit for the frontend
- Anvil for local development
- Tailwind CSS for styling

## Project Structure

```bash
src/
├── lib/
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── OnchainUI.sol        # Main contract
│   │   │   └── interfaces/
│   │   │       └── IUIErrors.sol     # Contract errors
│   │   └── contractBytecodes.ts      # Compiled contract bytecode
│   ├── OnchainUI.ts                  # Contract interface
│   ├── OnchainUIABI.ts              # Contract ABI
│   ├── UIContractHandler.ts          # Contract deployment handler
│   ├── chainConfigs.ts              # Chain configuration
│   ├── client.ts                    # Tevm client setup
│   └── types.ts                     # TypeScript types
├── routes/
│   ├── +page.svelte                # Landing page
│   └── form/
│       └── +page.svelte            # Form demo page
└── stores/
    ├── uiStore.ts                  # UI state store
    └── clientStore.ts              # Client state store
```

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Install Foundry (for Anvil):

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

## Development Workflow

1. Start Anvil in one terminal:

    ```bash
    anvil
    ```

2. Start the development server in another terminal:

    ```bash
    npm run dev
    ```

3. After making changes to the contract (OnchainUI.sol) or ABI (OnchainUIABI.ts), update the bytecodes:

    ```bash
    bun run update-bytecodes
    ```

4. Restart the dev server to use the new bytecodes:

```bash
bun run dev
```

## Smart Contract Features

The `OnchainUI.sol` contract supports:

- HTML elements with attributes and inner content
- Parent-child relationships between elements
- Event handlers with payloads
- Style management
- Component templates
- State management
- Component libraries
- Layout system

## Component Creation

```typescript
// Initialize with Anvil for development
const ui = new OnchainUI("dev");

// Create a form with Tailwind classes
const formId = await ui.addElement(
    "form",
    "",
    ["class"],
    ["max-w-md mx-auto mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"]
);

// Add child elements
const titleId = await ui.addElement(
    "h2",
    "Sign Up",
    ["class"],
    ["text-2xl font-bold text-gray-900 text-center mb-8"]
);

// Add parent-child relationship
await ui.addChildElement(formId, titleId);
```

## Styling

All styles are stored as Tailwind classes in the contract:

```typescript
await ui.addElement(
    "button",
    "Sign Up",
    ["class"],
    ["w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"]
);
```

## Event Handling

```typescript
await ui.addEventHandler(
    buttonId,
    "click",
    "validateForm",
    `0x${stringToHex(JSON.stringify({
        requiredFields: ["email", "password"]
    }))}`
);
```

## State Management

```typescript
await ui.updateState(
    "formData",
    `0x${stringToHex(JSON.stringify({
        email: "",
        password: "",
        errors: {}
    }))}`
);
```

## Troubleshooting

1. Contract Deployment Issues:
   - Ensure Anvil is running (`anvil` command)
   - Check you're using "dev" mode
   - Run `bun run update-bytecodes` after contract changes
   - Verify test account has ETH

2. Component Display Issues:
   - Check browser console for errors
   - Verify contract deployment succeeded
   - Check element count is > 0
   - Ensure parent-child relationships are set

3. Network Issues:
   - Verify Anvil is running on port 8545
   - Check network configuration in chainConfigs.ts
   - Ensure proper RPC URLs are set

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
