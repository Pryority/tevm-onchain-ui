import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const CONTRACT_NAME = "OnchainUI";
const OUTPUT_FILE = "src/lib/OnchainUIBytecodes.ts";
const CONTRACT_OUT_DIR = "src/lib/contracts/out";

function buildContract() {
	execSync("forge build --silent", { stdio: "pipe" });
}

function getBytecode(): string {
	const output = execSync(
		`cat ./${CONTRACT_OUT_DIR}/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json | jq -r '.bytecode.object'`,
		{ stdio: "pipe" },
	);
	return output.toString().trim();
}

function getDeployedBytecode(): string {
	const output = execSync(
		`cat ./${CONTRACT_OUT_DIR}/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json | jq -r '.deployedBytecode.object'`,
		{ stdio: "pipe" },
	);
	return output.toString().trim();
}

function generateTypeScriptFile(bytecode: string, deployedBytecode: string) {
	const content = `
import type { Hex } from "tevm";
// This file is auto-generated. Do not edit manually.

export const ONCHAIN_UI_BYTECODE = "${bytecode}" as Hex;
export const ONCHAIN_UI_DEPLOYED_BYTECODE = "${deployedBytecode}" as Hex;
`;

	fs.writeFileSync(OUTPUT_FILE, content);
	console.log(`Updated ${OUTPUT_FILE}`);
}

try {
	console.log("Building contract...");
	buildContract();

	console.log("Generating TypeScript file...");
	const bytecode = getBytecode();
	const deployedBytecode = getDeployedBytecode();
	generateTypeScriptFile(bytecode, deployedBytecode);

	console.log("Done!");
} catch (error) {
	console.error("Error updating bytecodes:", error);
	process.exit(1);
}
