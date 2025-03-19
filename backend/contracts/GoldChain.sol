// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.29;

import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IDataStorage.sol";

/**
 * @title GoldChain
 * @author Mathieu TUDELA
 * @dev Allows registered jewelers to deliver digital certificates
 */
contract GoldChain is AccessControl {

     /* ::::::::::::::: ROLES :::::::::::::::::: */
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant JEWELERS_ROLE = keccak256("JEWELERS_ROLE");
    bytes32 public constant CUSTOMERS_ROLE = keccak256("CUSTOMERS_ROLE");
    bytes32 public constant CERTIFICATOR_ROLE = keccak256("CERTIFICATOR_ROLE");

    address public admin;

    /* ::::::::::::::: EVENTS :::::::::::::::::: */
    /// @notice Event triggered when a jeweler is created.
    /// @param jewelerAddress the jeweler's address.
    /// @param timestamp the event datetime.
    event jewelerCreated(address jewelerAddress, uint timestamp);

    /// @notice Event triggered when a customer is created.
    /// @param customerAddress the customer's address.
    /// @param timestamp the event datetime.
    event customerCreated(address customerAddress, uint timestamp);

    /// @notice Event triggered when a Jeweler is registered.
    /// @param jewelerAddress the Jeweler's address.
    /// @param timestamp the event datetime.
    /// @param certificateId the ID of the certificate
    event certificateCreated(address jewelerAddress, uint timestamp, uint certificateId);

    /* ::::::::::::::: VARIABLES  :::::::::::::::::: */
    IDataStorage private dataStorage;

    /* ::::::::::::::: CONSTRUCTOR :::::::::::::::::: */
    constructor(IDataStorage _dataStorage) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN, msg.sender);
        admin = msg.sender;
        dataStorage = _dataStorage;
    }


    /* ::::::::::::::: ERRORS :::::::::::::::::: */
    /// @notice the jeweler is already registered
    error JewelerIsAlreadyRegistered();
    /// @notice the customer is already registered
    error CustomerIsAlreadyRegistered();

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    function createCustomer(
        string calldata _name,
        string calldata _email,
        bool _visible
        ) external returns (bool) {
            if (hasRole(CUSTOMERS_ROLE, msg.sender)) {
                revert CustomerIsAlreadyRegistered();
            }
            _grantRole(CUSTOMERS_ROLE, msg.sender);
            dataStorage.addCustomer(
                msg.sender, 
                _name, 
                _email, 
                _visible);
            emit customerCreated(msg.sender, block.timestamp);
        return true;
    }

    function createJeweler(
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _available,
        bool _visible
        ) external returns (bool) {
            if (hasRole(JEWELERS_ROLE, msg.sender)) {
                revert JewelerIsAlreadyRegistered();
            }
            _grantRole(JEWELERS_ROLE, msg.sender);
            dataStorage.addJeweler(
                msg.sender, 
                _name, 
                _email, 
                _location,
                _available,
                _visible);
            emit jewelerCreated(msg.sender, block.timestamp);
        return true;
    }

    function createCertificate(
        uint8[] calldata _materials,
        uint8[] calldata _gemStones,
        uint8 _weightInGrams,
        string calldata _mainColor, //enum ? 
        IDataStorage.CertificateLevel _level,
        string calldata _JewelerName,
        IDataStorage.CertificateStatus _status
    ) external onlyRole(JEWELERS_ROLE)  returns (bool) {
        dataStorage.addCertificate(
            _materials, 
            _gemStones, 
            _weightInGrams, 
            _mainColor, 
            _level, 
            _JewelerName, 
            _status
            );
        return true;
    }

    function updateCustomer() external returns (bool) {
        return true;
    }

    function updateJeweler() external returns (bool) {
        return true;
    }

    function updateCertificate() external returns (bool) {
        return true;
    }

    function transertCertificate() external returns (bool) {
        return true;
    }

    /// @notice fetch a jeweler.
    /// @param _jewelerAddress, the id of the jeweler.
    /// @return Jeweler, a representation of the selected jeweler.
    function getOneJeweler(address _jewelerAddress) public view returns(IDataStorage.Jeweler memory) {
        return dataStorage.getOneJeweler(_jewelerAddress);
    }

    /// @notice fetch a jeweler.
    /// @param _customerAddress, the id of the jeweler.
    /// @return Customer, a representation of the selected jeweler.
    function getOneCustomer(address _customerAddress) public view returns(IDataStorage.Customer memory) {
        return dataStorage.getOneCustomer(_customerAddress);
    }
}
