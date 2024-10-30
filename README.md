# Onchain Components

A proof-of-concept for storing UI components entirely on-chain using Tevm and Solidity.

## Overview

This project demonstrates how to store and render HTML components directly from the blockchain. It uses:

- Tevm for local blockchain simulation
- Solidity for smart contract storage
- SvelteKit for the frontend
- Anvil for local development

## Project Structure

```bash
src/
├── lib/
│   ├── OnchainUI.ts             # Contract interface
│   ├── OnchainUIClient.ts       # Client for interacting with the contract
│   ├── chainConfigs.ts          # Chain configuration
│   ├── contractABIs.ts          # Contract ABIs
│   ├── newMemoryClient.ts       # Tevm memory client setup
│   └── contracts/
│       ├── src/
│       │   └── OnchainUI.sol    # Solidity contract
│       └── contractBytecodes.ts # Compiled contract bytecode
├── routes/
│   └── +page.svelte            # Main page component
└── stores/
    └── uiClient.ts      # Svelte store for client
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

## Running the Project

1. Start Anvil in one terminal:

    ```bash
    anvil
    ```

2. Start the development server in another terminal:

    ```bash
    npm run dev
    ```

3. Open `http://localhost:5173` in your browser

The application will:

- Deploy the OnchainUI contract to your local Anvil instance
- Add example UI components
- Render them in the browser

## Smart Contract

The `OnchainUI.sol` contract stores HTML elements and their attributes:

```solidity
contract OnchainUI {
    struct HTMLElement {
        string tagName;      // e.g., "div", "input", "p"
        string innerHTML;    // inner content or value
        mapping(string => string) attributes; // stores attributes like class, id, etc
        bool exists;
    }

    mapping(uint256 => HTMLElement) public elements;
    uint256 public elementCount;
}
```

## Client Usage

```typescript
// Initialize with Anvil for development
const client = new OnchainUIClient("dev");

// Add an element
await client.addElement(
    "div",
    "Hello from the blockchain!",
    ["class", "id"],
    ["my-class", "my-id"]
);

// Get all elements
const count = await client.getElementCount();
for (let i = 0; i < count; i++) {
    const element = await client.getElement(i);
    const id = await client.getAttribute(i, "id");
    const className = await client.getAttribute(i, "class");
    // Use the element...
}
```

## Supported Networks

The project supports multiple networks through `chainConfigs.ts`:

- `anvil`: Local development (default)
- `base`: Base mainnet
- `redstone`: Redstone chain
- `zora`: Zora network

## Example Components

The project includes several demo components:

- Modal/Dialog boxes
- Forms with inputs
- Cards with images
- Navigation menus
- Loading spinners

Each component is stored entirely on-chain, including:

- HTML structure
- Content
- Attributes
- Styling classes

## Development vs Production

### Development Mode

```typescript
const client = new OnchainUIClient("dev");
```

- Uses local Anvil blockchain
- Uses test account (pre-funded)
- Fast, free transactions

### Production Mode

```typescript
const client = new OnchainUIClient("prod");
```

- Connects to real networks
- Requires real accounts and ETH
- Real blockchain transactions

## Troubleshooting

1. Contract Deployment Issues:
   - Ensure Anvil is running (`anvil` command)
   - Check you're using "dev" mode
   - Verify test account has ETH

2. Component Display Issues:
   - Check browser console for errors
   - Verify contract deployment succeeded
   - Check element count is > 0

3. Network Issues:
   - Verify Anvil is running on port 8545
   - Check network configuration in chainConfigs.ts
   - Ensure proper RPC URLs are set

## Benefits

1. **Versioning**: Components can be versioned by deploying new contracts
2. **Reusability**: Components are accessible to any dApp
3. **Composability**: Components can reference other on-chain components
4. **Customization**: Components are customizable through attributes
5. **Immutability**: Once deployed, components cannot be altered

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
