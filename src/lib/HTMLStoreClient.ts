import { newMemoryClient } from "$lib/newMemoryClient";
import type { Account, Address } from "tevm";
import { encodeFunctionData } from "viem";
import { HTMLStore } from "./HTMLStore";

// Anvil's first test account
const TEST_ACCOUNT = {
	address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as const,
	balance: 10000000000000000000000n,
	privateKey:
		"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const,
} as const;

export interface HTMLElementData {
	tagName: string;
	innerHTML: string;
	exists: boolean;
}

export class HTMLStoreClient {
	private client;
	private htmlStore: HTMLStore;
	private deployedAddress: Address | undefined;
	private deploymentPromise: Promise<void>;
	private initializationPromise: Promise<void>;

	constructor(isDev: string) {
		this.client =
			isDev === "dev"
				? newMemoryClient("anvil", TEST_ACCOUNT.address as Address)
				: newMemoryClient("base");
		this.htmlStore = new HTMLStore();
		this.deploymentPromise = this.deployContract();
		this.initializationPromise = this.initializeElements();
	}

	private async deployContract() {
		try {
			console.log("Starting contract deployment...");

			const deployResult = await this.client.tevmDeploy({
				...this.htmlStore.undeployedContract.deploy(),
				from: TEST_ACCOUNT.address,
			});

			if (!deployResult.createdAddress) {
				throw new Error("Contract deployment failed - no address returned");
			}

			this.deployedAddress = deployResult.createdAddress;
			console.log("Contract deployed to", this.deployedAddress);

			// Mine a block to ensure the deployment is processed
			await this.client.mine({ blocks: 1 });

			// Verify the contract exists
			const code = await this.client.getCode({
				address: this.deployedAddress,
				blockTag: "latest",
			});

			console.log("Contract code:", code);

			if (!code || code === "0x") {
				throw new Error("Contract deployment failed - no code at address");
			}

			// Mine another block to ensure everything is settled
			await this.client.mine({ blocks: 1 });

			console.log("Contract code verified");
		} catch (error) {
			console.error("Deployment error:", error);
			throw error;
		}
	}

	private async initializeElements() {
		try {
			await this.deploymentPromise;
			if (!this.deployedAddress) throw new Error("Contract not deployed");

			// Add a test element
			console.log("Adding test element");

			// Get initial count
			const beforeCount = await this.client.tevmContract({
				to: this.deployedAddress,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "elementCount",
			});

			console.log("Count before adding:", Number(beforeCount.data));

			const addResult = await this.client.tevmContract({
				to: this.deployedAddress,
				from: TEST_ACCOUNT.address,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "addElement",
				args: [
					"div",
					"Hello from the blockchain!",
					["class", "id"],
					["test-class", "test-div"],
				],
				createTransaction: "on-success",
			});

			console.log("Raw add result:", addResult);

			if (addResult.errors) {
				console.error("Add element errors:", addResult.errors);
				throw new Error(
					`Failed to add element: ${addResult.errors[0].message}`,
				);
			}

			// Mine a block to process the transaction
			await this.client.mine({ blocks: 1 });

			// Verify the element was added
			const afterCount = await this.client.tevmContract({
				to: this.deployedAddress,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "elementCount",
			});

			const newCount = Number(afterCount.data);
			console.log("Count after adding:", newCount);

			if (newCount <= Number(beforeCount.data)) {
				throw new Error("Element was not added successfully");
			}

			// Try to read the element
			const element = await this.client.tevmContract({
				to: this.deployedAddress,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "getElement",
				args: [BigInt(newCount - 1)],
			});

			console.log("First element:", element.data);
		} catch (error) {
			console.error("Element initialization error:", error);
			throw error;
		}
	}

	async addElement(
		tagName: string,
		innerHTML: string,
		attrNames: string[],
		attrValues: string[],
	): Promise<number> {
		try {
			const address = await this.ensureDeployed();
			console.log("Adding element", {
				tagName,
				innerHTML,
				attrNames,
				attrValues,
			});

			// Get the current count before adding
			const beforeCount = await this.client.tevmContract({
				to: address,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "elementCount",
			});

			console.log("Count before adding:", Number(beforeCount.data));

			const result = await this.client.tevmContract({
				to: address,
				from: TEST_ACCOUNT.address,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "addElement",
				args: [tagName, innerHTML, attrNames, attrValues],
				createTransaction: "on-success",
			});

			console.log("Raw transaction result:", result);

			if (result.errors) {
				throw new Error(`Error adding element: ${result.errors[0].message}`);
			}

			// Mine a block to process the transaction
			await this.client.mine({ blocks: 1 });

			// Verify the element was added
			const afterCount = await this.client.tevmContract({
				to: address,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "elementCount",
			});

			const newCount = Number(afterCount.data);
			console.log("Count after adding:", newCount);

			if (newCount <= Number(beforeCount.data)) {
				throw new Error("Element was not added successfully");
			}

			return newCount - 1;
		} catch (error) {
			console.error("Error adding element:", error);
			throw error;
		}
	}

	async getElementCount(): Promise<number> {
		try {
			const address = await this.ensureDeployed();
			const result = await this.client.tevmContract({
				to: address,
				abi: this.htmlStore.undeployedContract.abi,
				functionName: "elementCount",
			});

			if (result.errors) {
				throw new Error(result.errors[0].message);
			}

			return Number(result.data);
		} catch (error) {
			console.error("Error getting element count:", error);
			throw error;
		}
	}

	async getElement(id: number): Promise<HTMLElementData> {
		const address = await this.ensureDeployed();
		const result = await this.client.tevmContract({
			to: address,
			abi: this.htmlStore.undeployedContract.abi,
			functionName: "getElement",
			args: [BigInt(id)],
		});

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		if (!result.data) {
			throw new Error("No data returned from getElement");
		}

		return {
			tagName: result.data[0],
			innerHTML: result.data[1],
			exists: result.data[2],
		};
	}

	async getAttribute(id: number, attrName: string): Promise<string> {
		const address = await this.ensureDeployed();
		const result = await this.client.tevmContract({
			to: address,
			abi: this.htmlStore.undeployedContract.abi,
			functionName: "getAttribute",
			args: [BigInt(id), attrName],
		});

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		if (!result.data) {
			throw new Error("No data returned from getAttribute");
		}

		return result.data[0];
	}

	private async ensureDeployed() {
		try {
			await Promise.all([this.deploymentPromise, this.initializationPromise]);
			if (!this.deployedAddress) {
				throw new Error("Contract not deployed");
			}
			return this.deployedAddress;
		} catch (error) {
			console.error("Error ensuring contract is deployed:", error);
			throw error;
		}
	}
}
