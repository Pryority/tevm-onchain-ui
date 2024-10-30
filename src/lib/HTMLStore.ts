import { type Contract, createContract } from "tevm";
import type { Address, Hex } from "tevm";
import { HTMLStoreClient } from "./HTMLStoreClient";
import { HTMLStoreABI } from "./contractABIs";
import { HTMLStoreBytecodes } from "./contracts/contractBytecodes";

// This is the bytecode of your compiled HTMLStore.sol contract

export class HTMLStore {
	public undeployedContract: Contract<
		"HTMLStore",
		typeof HTMLStoreABI,
		undefined,
		Hex,
		Hex
	>;

	constructor() {
		this.undeployedContract = createContract({
			name: "HTMLStore",
			humanReadableAbi: [...HTMLStoreABI] as const,
			bytecode: HTMLStoreBytecodes.bytecode,
			deployedBytecode: HTMLStoreBytecodes.deployedBytecode,
		});
	}
}
