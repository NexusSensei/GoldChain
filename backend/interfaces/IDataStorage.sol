// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.29;

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

    struct Customers {
        uint created_at;
        uint updated_at;
        string name;
        string email;
        bool visible;
        uint[] OwnedCertificateIds; 
    }

    struct Certificate {
        uint creationDate;
        uint8[] materials;
        uint8[] gemStones;
        uint8 weightInGrams;
        string mainColor; //enum ? 
        CertificateLevel level;
        string JewelerName;
        CertificateStatus status;
    }


    /* ::::::::::::::: FUNCTIONS  :::::::::::::::::: */

    function createJeweler(
        address _jewelerAddress, 
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _available,
        bool _visible
    ) external;    
}