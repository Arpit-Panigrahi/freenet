// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DomainRegistry {
    struct Domain {
        address owner;
        string cid;
        uint256 registeredAt;
    }

    mapping(string => Domain) private registry;
    mapping(address => string[]) private ownerToDomains; // Added for Dashboard tracking

    modifier onlyOwner(string memory _name) {
        require(registry[_name].owner == msg.sender, "Not domain owner");
        _;
    }

    function register(string memory _name, string memory _cid) external {
        require(bytes(_name).length > 0 && bytes(_cid).length > 0, "Invalid inputs");
        require(registry[_name].owner == address(0), "Domain already taken");

        registry[_name] = Domain(msg.sender, _cid, block.timestamp);
        ownerToDomains[msg.sender].push(_name);
    }

    function updateCID(string memory _name, string memory _newCid) external onlyOwner(_name) {
        require(bytes(_newCid).length > 0, "CID cannot be empty");
        registry[_name].cid = _newCid;
    }

    function resolve(string memory _name) external view returns (string memory cid, address owner) {
        require(registry[_name].owner != address(0), "Domain not found");
        return (registry[_name].cid, registry[_name].owner);
    }

    function getUserDomains(address _user) external view returns (string[] memory) {
        return ownerToDomains[_user];
    }
}