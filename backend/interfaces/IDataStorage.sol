// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

/**
 * @title IDataStorage
 * @author Mathieu TUDELA
 * @notice This contract is the data storage contract.
 * @notice It stores all the data of the GoldChain application
 */
 interface IDataStorage {

    /* ::::::::::::::: STRUCTURES  :::::::::::::::::: */

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
        string location;
        bool visible;
        uint[] OwnedCertificateIds; 
    }

    struct Certificate {
        uint creationDate;
        uint updated_at;
        uint8 materials;
        uint8 gemStones;
        uint8 weightInGrams;
        string mainColor; //enum ? 
        CertificateLevel level;
        string JewelerName;
        //transfers
        CertificateStatus status;
    }


    /* ::::::::::::::: FUNCTIONS  :::::::::::::::::: */

    function addJeweler(
        address _jewelerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _available,
        bool _visible
    ) external  returns (bool);    

    function addCustomer(
        address _customerAddress, 
        string calldata _name,
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external returns (bool);

    function addCertificate(
        uint8  _materials,
        uint8  _gemStones,
        uint8 _weightInGrams,
        string calldata _mainColor, //enum ? 
        CertificateLevel _level,
        string calldata _JewelerName,
        CertificateStatus _status
    ) external returns (bool);

    function updateCustomer(
        address _customerAddress, 
        string calldata _name,
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external returns (bool);

    function updateJeweler(
        address _jewelerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external returns (bool);

    function activateJeweler(address _jewelerAddress) external returns (bool);

    function desactivateJeweler(address _jewelerAddress) external returns (bool);

    function updateCertificateStatus(uint _certificateId, CertificateStatus _status) external returns (bool);

    function getOneJeweler(address _jewelerAddress) external view returns(Jeweler memory);

    function getOneCustomer(address _customerAddress) external view returns(Customer memory);

    function getCustomerCount() external view returns(uint);

    function getJewelerCount() external view returns(uint);

    function getOneCertificate(uint _certificateId) external view returns(Certificate memory);

    function getCertificateCount() external view returns(uint);
}