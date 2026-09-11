// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DomainRegistry.sol";

contract DeployDomainRegistry is Script {
    function run() external returns (DomainRegistry) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        DomainRegistry registry = new DomainRegistry();

        vm.stopBroadcast();
        return registry;
    }
}