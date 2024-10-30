<script lang="ts">
</script>

<main>
  <h1>Onchain UI Components</h1>

  <section class="intro">
    <p>
      A proof-of-concept for storing UI components entirely on-chain using Tevm
      and Solidity. This project demonstrates how to store and render HTML
      components directly from the blockchain.
    </p>
  </section>

  <section class="features">
    <h2>How it Works</h2>
    <ul>
      <li>
        <strong>Smart Contract Storage:</strong> UI components are stored in a Solidity
        contract that manages HTML elements, attributes, and their relationships.
      </li>
      <li>
        <strong>Local Development:</strong> Uses Tevm for local blockchain simulation
        and Anvil for development.
      </li>
      <li>
        <strong>Component Management:</strong> Supports nested elements, event handlers,
        styles, and state management.
      </li>
      <li>
        <strong>Dynamic Updates:</strong> Components can be updated and modified
        through blockchain transactions.
      </li>
    </ul>
  </section>

  <section class="demo">
    <h2>Live Demo</h2>
    <p>
      Check out our onchain form component demo. Every element, style, and
      interaction is stored and managed through smart contracts.
    </p>
    <a href="/form" class="demo-button">View Form Demo</a>
  </section>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
  }

  h2 {
    font-size: 1.8rem;
    color: #2a2a2a;
    margin: 2rem 0 1rem;
  }

  section {
    margin-bottom: 3rem;
  }

  .intro p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #4a4a4a;
  }

  .features ul {
    list-style: none;
    padding: 0;
  }

  .features li {
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .features strong {
    color: #0066cc;
  }

  .demo {
    background: #f5f5f5;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }

  .demo p {
    margin-bottom: 1.5rem;
  }

  .demo-button {
    display: inline-block;
    padding: 1rem 2rem;
    background: #0066cc;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .demo-button:hover {
    background: #0052a3;
  }

  @media (max-width: 600px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .intro p {
      font-size: 1.1rem;
    }
  }
</style>
