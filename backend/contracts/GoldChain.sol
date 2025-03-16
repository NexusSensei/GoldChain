// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.29;

import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title GoldChain
 * @author Mathieu TUDELA
 * @dev Allows registered jewelers to deliver digital certificates
 */
contract GoldChain is AccessControl {

     /* ::::::::::::::: ROLES :::::::::::::::::: */
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant JEWELERS_ROLE = keccak256("JEWELERS_ROLE");
    bytes32 public constant CERTIFICATOR_ROLE = keccak256("CERTIFICATOR_ROLE");

    address public admin;

    /* ::::::::::::::: EVENTS :::::::::::::::::: */

    /// @notice Event triggered when a Jeweler is registered.
    /// @param jewelerAddress the Jeweler's address.
    /// @param timestamp the event datetime.
    event JewelerRegistered(address jewelerAddress, uint timestamp);

    /* ::::::::::::::: CONSTRUCTOR :::::::::::::::::: */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN, msg.sender);
        admin = msg.sender;

    }


    /* ::::::::::::::: ERRORS :::::::::::::::::: */

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        
    }
}
