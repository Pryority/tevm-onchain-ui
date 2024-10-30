import {
	ONCHAIN_UI_BYTECODE as bytecode,
	ONCHAIN_UI_DEPLOYED_BYTECODE as deployedBytecode,
} from "$lib/OnchainUIBytecodes";
import { type Contract, createContract } from "tevm";
import type { Address, Hex } from "tevm";
import { ONCHAIN_UI_ABI as humanReadableAbi } from "./OnchainUIABI";
type ContractName = "OnchainUI";
type ContractAddress = Address | undefined;

export class UIContractHandler {
	public undeployedContract: Contract<
		ContractName,
		typeof humanReadableAbi,
		ContractAddress,
		Hex,
		Hex
	>;

	constructor() {
		this.undeployedContract = createContract({
			name: "OnchainUI",
			humanReadableAbi,
			bytecode,
			deployedBytecode,
		});
	}
}
