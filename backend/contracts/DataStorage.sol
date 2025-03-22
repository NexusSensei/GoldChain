// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DataStorage
 * @author Mathieu TUDELA
 * @notice This contract is the data storage contract.
 * @notice It stores all the data of the GoldChain application
 */
 contract DataStorage  is Ownable  {

    /* ::::::::::::::: STRUCTURES + ENUMS  :::::::::::::::::: */

    enum CertificateStatus {
        CREATED,
        TRANSFERRED_ONCE,
        TRANSFERRED_TWICE_OR_MORE,
        LOST,
        STOLEN
    }

    enum CertificateLevel {
        NONE,
        DOCUMENTS,
        NFC_CHIP,
        RFID_CHIP
    }

    enum Materials {
        GOLD,
        SILVER,
        PLATINUM,
        PALLADIUM,
        TITANIUM,
        RHODIUM,
        COPPER,
        OTHER
    }

    enum GemStones
    {
        NONE,
        DIAMOND,
        SAPPHIRE,
        RUBY,
        EMERALD,
        OTHER
    }

    struct Jeweler {
        uint created_at;
        uint updated_at;        
        string name;
        string email;
        string location;
        uint[] CreatedCertificateIds; 
        bool available;
        bool visible;
    }

    struct Customer {
        uint created_at;
        uint updated_at;
        string name;
        string email;
        bool visible;
        uint[] OwnedCertificateIds; 
    }

    struct Certificate {
        uint creationDate;
        uint updated_at;
        uint8[] materials;
        uint8[] gemStones;
        uint8 weightInGrams;
        string mainColor; //enum ? 
        CertificateLevel level;
        string JewelerName;
        //transfers
        CertificateStatus status;
    }

    /* ::::::::::::::: VARIABLES  :::::::::::::::::: */
    uint private _jewelerCount;
    uint private _customerCount;
    uint private _certificateCount;
    address[] private _jewelerAddresses;
    address[] private _customerAddresses;
    mapping(address => Jeweler) public jewelers;
    mapping(address => Customer) public customers;
    mapping(uint => Certificate) public certificates;


    constructor() Ownable(msg.sender) {
        
    }

    /* ::::::::::::::: FUNCTIONS  :::::::::::::::::: */

    function addJeweler(
        address _jewelerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _available,
        bool _visible
    ) external  returns (bool) {
        jewelers[_jewelerAddress] = Jeweler(
            block.timestamp,
            block.timestamp,       
            _name,
            _email,
            _location,
            new uint[](0), 
            _available,
            _visible
        );
        _jewelerCount += 1;
        _jewelerAddresses.push(_jewelerAddress);
        return true;
    }    

    function addCustomer(
        address _customerAddress, 
        string calldata _name,
        string calldata _email,
        bool _visible
    ) external returns (bool) {
        customers[_customerAddress] = Customer(
            block.timestamp,
            block.timestamp,  
            _name,
            _email,
            _visible,
            new uint[](0)            
        );
        _customerCount += 1;
        _customerAddresses.push(_customerAddress);
        return true;
    }

    function addCertificate(
        uint8[] calldata _materials,
        uint8[] calldata _gemStones,
        uint8 _weightInGrams,
        string calldata _mainColor, //enum ? 
        CertificateLevel _level,
        string calldata _JewelerName,
        CertificateStatus _status
    ) external returns (bool) {        
        certificates[_certificateCount] = Certificate (
            block.timestamp,
            block.timestamp, 
            _materials,
            _gemStones,
            _weightInGrams,
            _mainColor,
            _level,
            _JewelerName,
            _status
        );
        _certificateCount += 1;
        return true;
    }

    function updateCustomer(
        address _customerAddress, 
        string calldata _name,
        string calldata _email,
        bool _visible
    ) external returns (bool) {
        customers[_customerAddress].updated_at = block.timestamp;
        customers[_customerAddress].name = _name;
        customers[_customerAddress].email = _email;
        customers[_customerAddress].visible = _visible;
        return true;
    }

    function updateJeweler(
        address _jewelerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _available,
        bool _visible
    ) external returns (bool) {
        jewelers[_jewelerAddress].updated_at = block.timestamp;
        jewelers[_jewelerAddress].name = _name;
        jewelers[_jewelerAddress].email = _email;
        jewelers[_jewelerAddress].location = _location;
        jewelers[_jewelerAddress].visible = _visible;
        return true;
    }

    function activateJeweler(address _jewelerAddress) external returns (bool) {
        jewelers[_jewelerAddress].available = true;
        return true;
    }

    function desactivateJeweler(address _jewelerAddress) external returns (bool) {
        jewelers[_jewelerAddress].available = false;
        return true;
    }

    function updateCertificate() external returns (bool) {
        return true;
    }

    function transertCertificate() external returns (bool) {
        return true;
    }

    function getOneJeweler(address _jewelerAddress) public view returns(Jeweler memory) {
        return jewelers[_jewelerAddress];
    }

    function getOneCustomer(address _customerAddress) public view returns(Customer memory) {
        return customers[_customerAddress];
    }

    function getCustomerCount() external view returns(uint) {
        return _customerCount;
    }   

    function getJewelerCount() external view returns(uint) {
        return _jewelerCount;
    }

    function getCertificateCount() external view returns(uint) {
        return _certificateCount;
    }
}