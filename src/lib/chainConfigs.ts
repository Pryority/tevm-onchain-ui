import { type Common, anvil, base, redstone, zora } from "tevm/common";

export type ChainConfigKey = "anvil" | "redstone" | "base" | "zora";

export const chainConfigs: Record<
	ChainConfigKey,
	{
		name: string;
		rpcUrl: string;
		color: string;
		chainId: number;
		nativeCurrency: {
			name: string;
			symbol: string;
			decimals: number;
		};
		common: Common;
	}
> = {
	anvil: {
		name: "Anvil",
		rpcUrl: "http://127.0.0.1:8545",
		color: "red",
		chainId: 31337,
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		common: anvil,
	},
	redstone: {
		name: "Redstone",
		rpcUrl: "https://rpc.redstonechain.com",
		color: "red",
		chainId: 17001,
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		common: redstone,
	},
	base: {
		name: "Base",
		rpcUrl: "https://mainnet.base.org",
		color: "blue",
		chainId: 8453,
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		common: base,
	},
	zora: {
		name: "Zora",
		rpcUrl: "https://rpc.zora.energy",
		color: "purple",
		chainId: 7777777,
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		common: zora,
	},
};
