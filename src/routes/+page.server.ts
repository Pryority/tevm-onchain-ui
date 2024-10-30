import { type ChainConfigKey, chainConfigs } from "$lib/chainConfigs";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const initialChain: ChainConfigKey = "anvil";

	return {
		initialChain,
		networkName: chainConfigs[initialChain].name,
		rpcUrl: chainConfigs[initialChain].rpcUrl,
	};
};
