// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/AccessControl.sol";
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

    /// @notice Event triggered when a customer is updated.
    /// @param customerAddress the customer's address.
    /// @param timestamp the event datetime.
    event customerUpdated(address customerAddress, uint timestamp);

    /// @notice Event triggered when a jeweler is updated.
    /// @param jewelerAddress the jeweler's address.
    /// @param timestamp the event datetime.
    event jewelerUpdated(address jewelerAddress, uint timestamp);

    /* ::::::::::::::: VARIABLES  :::::::::::::::::: */
    IDataStorage private dataStorage;
    address public admin;
    bool public constant FALSE = false;
    bool public constant TRUE = true;

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
    /// @notice the customer does not exist
    error CustomerNotExists();
    /// @notice the jeweler does not exist
    error JewelerNotExists();

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    function createCustomer(
        string calldata _name,
        string calldata _email
        ) external returns (bool) {
            if (hasRole(CUSTOMERS_ROLE, msg.sender)) {
                revert CustomerIsAlreadyRegistered();
            }
            _grantRole(CUSTOMERS_ROLE, msg.sender);
            dataStorage.addCustomer(
                msg.sender, 
                _name, 
                _email, 
                TRUE);
            emit customerCreated(msg.sender, block.timestamp);
        return true;
    }

    function createJeweler(
        string calldata _name, 
        string calldata _email,
        string calldata _location
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
                FALSE,
                TRUE);
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

    function updateCustomer(
        string calldata _name,
        string calldata _email,
        bool _visible
    ) external onlyRole(CUSTOMERS_ROLE) returns (bool) {
        if (dataStorage.getOneCustomer(msg.sender).created_at == 0) {
            revert CustomerNotExists();
        }
        dataStorage.updateCustomer(
            msg.sender, 
            _name, 
            _email, 
            _visible
            );
        emit customerUpdated(msg.sender, block.timestamp);
        return true;
    }

    function updateJeweler(
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external onlyRole(JEWELERS_ROLE) returns (bool) {
        if (dataStorage.getOneJeweler(msg.sender).created_at == 0) {
            revert JewelerNotExists();
        }
        dataStorage.updateJeweler(
            msg.sender, 
            _name, 
            _email, 
            _location, 
            _visible
            );
        emit jewelerUpdated(msg.sender, block.timestamp);
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

    /* ::::::::::::::: ADMIN FUNCTIONS :::::::::::::::::: */

    function activateJeweler(address _jewelerAddress) external onlyRole(ADMIN) returns (bool) {
        dataStorage.activateJeweler(_jewelerAddress);
        return true;
    }

    function desactivateJeweler(address _jewelerAddress) external onlyRole(ADMIN) returns (bool) {
        dataStorage.desactivateJeweler(_jewelerAddress);
        return true;
    }

    function getJewelerCount() external view returns (uint) {
        return dataStorage.getJewelerCount();
    }

    function getCustomerCount() external view returns (uint) {
        return dataStorage.getCustomerCount();
    }
    
}
