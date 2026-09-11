// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DomainRegistry.sol";

contract DomainRegistryTest is Test {
    DomainRegistry public registry;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        registry = new DomainRegistry();
    }

    function test_RegisterDomain() public {
        vm.prank(user1); // Simulate user1 calling the contract
        registry.register("myproject", "QmHash123");
        
        (string memory cid, address owner) = registry.resolve("myproject");
        assertEq(cid, "QmHash123");
        assertEq(owner, user1);
    }

    function test_RevertIfDuplicate() public {
        vm.prank(user1);
        registry.register("myproject", "QmHash123");

        vm.prank(user2);
        vm.expectRevert("Domain already taken");
        registry.register("myproject", "QmNewHash");
    }

    function test_UpdateCID() public {
        vm.prank(user1);
        registry.register("myproject", "QmHash123");

        vm.prank(user1);
        registry.updateCID("myproject", "QmUpdatedHash");

        (string memory newCid, ) = registry.resolve("myproject");
        assertEq(newCid, "QmUpdatedHash");
    }

    function test_RevertUnauthorizedUpdate() public {
        vm.prank(user1);
        registry.register("myproject", "QmHash123");

        vm.prank(user2); // user2 tries to update user1's domain
        vm.expectRevert("Not domain owner");
        registry.updateCID("myproject", "QmHackedHash");
    }

    function test_GetUserDomains() public {
        vm.prank(user1);
        registry.register("myproject", "QmHash123");
        vm.prank(user1);
        registry.register("secondproject", "QmHash456");

        string[] memory domains = registry.getUserDomains(user1);
        assertEq(domains.length, 2);
        assertEq(domains[0], "myproject");
        assertEq(domains[1], "secondproject");
    }
}