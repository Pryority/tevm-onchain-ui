// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {HTMLStore} from "../src/HTMLStore.sol";

contract HTMLStoreScript is Script {
    HTMLStore public htmlStore;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        htmlStore = new HTMLStore();

        vm.stopBroadcast();
    }
}
