import { http, createMemoryClient } from "tevm";
import type { Account, Address } from "tevm";
import { type ChainConfigKey, chainConfigs } from "./chainConfigs";

export const newMemoryClient = (
	chain: ChainConfigKey,
	simulationAccount?: Account | Address,
) => {
	return createMemoryClient({
		common: chainConfigs[chain].common,
		fork: {
			transport: http(chainConfigs[chain].rpcUrl)({}),
		},
		account: simulationAccount,
		miningConfig: {
			type: "interval",
			interval: 100,
		},
	});
};
