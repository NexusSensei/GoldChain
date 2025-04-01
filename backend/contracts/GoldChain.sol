// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IDataStorage.sol";
import "./NFTGoldChain.sol";
import "./constants/GoldChainConstants.sol";

/**
 * @title GoldChain
 * @author Mathieu TUDELA
 * @dev Allows registered jewelers to deliver digital certificates
 */
contract GoldChain is AccessControl, GoldChainERC721 {


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

    /// @notice Event triggered when a jeweler is activated.
    /// @param jewelerAddress the jeweler's address.
    /// @param timestamp the event datetime.
    event jewelerActivated(address jewelerAddress, uint timestamp);

    /// @notice Event triggered when a jeweler is desactivated.
    /// @param jewelerAddress the jeweler's address.
    /// @param timestamp the event datetime.
    event jewelerDesactivated(address jewelerAddress, uint timestamp);

    /* ::::::::::::::: VARIABLES  :::::::::::::::::: */
    IDataStorage private dataStorage;
    address public admin;
    bool public constant FALSE = false;
    bool public constant TRUE = true;

    /* ::::::::::::::: CONSTRUCTOR :::::::::::::::::: */
    constructor(IDataStorage _dataStorage) GoldChainERC721() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GoldChainConstants.ADMIN, msg.sender);
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
    /// @notice the token does not exist
    error TokenDoesNotExist();

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    function createCustomer(
        string calldata _name,
        string calldata _email,
        string calldata _location
    ) external returns (bool) {
        if (hasRole(GoldChainConstants.CUSTOMERS_ROLE, msg.sender)) {
            revert CustomerIsAlreadyRegistered();
        }
        _grantRole(GoldChainConstants.CUSTOMERS_ROLE, msg.sender);
        dataStorage.addCustomer(msg.sender, _name, _email, _location, TRUE);
        emit customerCreated(msg.sender, block.timestamp);
        return true;
    }

    function createJeweler(
        string calldata _name, 
        string calldata _email,
        string calldata _location
    ) external returns (bool) {
        if (hasRole(GoldChainConstants.JEWELERS_ROLE, msg.sender)) {
            revert JewelerIsAlreadyRegistered();
        }
        _grantRole(GoldChainConstants.JEWELERS_ROLE, msg.sender);
        dataStorage.addJeweler(msg.sender, _name, _email, _location, FALSE, TRUE);
        emit jewelerCreated(msg.sender, block.timestamp);
        return true;
    }

    function createCertificate(
        uint8 _materials,
        uint8 _gemStones,
        uint8 _weightInGrams,
        string calldata _mainColor,
        IDataStorage.CertificateLevel _level,
        string calldata _JewelerName,
        IDataStorage.CertificateStatus _status
    ) external onlyRole(GoldChainConstants.JEWELERS_ROLE) returns (bool) {
        dataStorage.addCertificate(
            _materials, 
            _gemStones, 
            _weightInGrams, 
            _mainColor, 
            _level, 
            _JewelerName, 
            _status
        );
        safeMint(msg.sender);
        return true;
    }

    function updateCustomer(
        string calldata _name,
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external onlyRole(GoldChainConstants.CUSTOMERS_ROLE) returns (bool) {
        dataStorage.updateCustomer(msg.sender, _name, _email, _location, _visible);
        emit customerUpdated(msg.sender, block.timestamp);
        return true;
    }

    function updateJeweler(
        string calldata _name, 
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external onlyRole(GoldChainConstants.JEWELERS_ROLE) returns (bool) {
        dataStorage.updateJeweler(msg.sender, _name, _email, _location, _visible);
        emit jewelerUpdated(msg.sender, block.timestamp);
        return true;
    }

    function updateCertificate() external returns (bool) {
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

    /// @notice fetch a certificate.
    /// @param _certificateId, the id of the certificate.
    /// @return Certificate, a representation of the selected certificate.
    function getOneCertificate(uint _certificateId) public view returns(IDataStorage.Certificate memory) {
        return dataStorage.getOneCertificate(_certificateId);
    }

    /* ::::::::::::::: ADMIN FUNCTIONS :::::::::::::::::: */

    function activateJeweler(address _jewelerAddress) external onlyRole(GoldChainConstants.ADMIN) returns (bool) {
        dataStorage.activateJeweler(_jewelerAddress);
        emit jewelerActivated(_jewelerAddress, block.timestamp);
        return true;
    }

    function desactivateJeweler(address _jewelerAddress) external onlyRole(GoldChainConstants.ADMIN) returns (bool) {
        dataStorage.desactivateJeweler(_jewelerAddress);
        emit jewelerDesactivated(_jewelerAddress, block.timestamp);
        return true;
    }

    function getJewelerCount() external view returns (uint) {
        return dataStorage.getJewelerCount();
    }

    function getCustomerCount() external view returns (uint) {
        return dataStorage.getCustomerCount();
    }

    function getTraits(uint _Id) internal view returns (string memory) {   
        IDataStorage.Certificate memory cert = dataStorage.getOneCertificate(_Id);             
        string memory o = string(abi.encodePacked(
            GoldChainConstants.JSON_JEWELER_NAME,
            cert.JewelerName,
            GoldChainConstants.JSON_MATERIAL,
            cert.materials,
            GoldChainConstants.JSON_GEMSTONE,
            cert.gemStones
        ));
        return string(abi.encodePacked(
            o,
            GoldChainConstants.JSON_WEIGHT,
            Strings.toString(cert.weightInGrams),
            GoldChainConstants.JSON_COLOR,
            cert.mainColor,
            GoldChainConstants.JSON_LEVEL,
            cert.level,
            GoldChainConstants.JSON_IMAGE
        ));
    }

    function genSVG(uint _Id) internal pure returns (string memory) {
        string memory output = string(abi.encodePacked(
            GoldChainConstants.SVG_HEADER,
            GoldChainConstants.SVG_BACKGROUND,
            GoldChainConstants.SVG_TITLE_START,
            GoldChainConstants.SVG_TITLE_TEXT,
            GoldChainConstants.SVG_TITLE_END
        ));
        output = string(abi.encodePacked(
            output,
            GoldChainConstants.SVG_RING_1,
            GoldChainConstants.SVG_RING_2,
            GoldChainConstants.SVG_DIAMOND_1,
            GoldChainConstants.SVG_DIAMOND_2
        ));
        output = string(abi.encodePacked(
            output,
            GoldChainConstants.SVG_DIAMOND_3,
            GoldChainConstants.SVG_DIAMOND_4,
            GoldChainConstants.SVG_BRAND_START,
            GoldChainConstants.SVG_BRAND_TEXT
        ));
        output = string(abi.encodePacked(
            output,
            GoldChainConstants.SVG_BRAND_END,
            GoldChainConstants.SVG_FRAME,
            GoldChainConstants.SVG_NUMBER_START
        ));
        return string(abi.encodePacked(
            output,
            GoldChainConstants.SVG_BRAND_END,
            Strings.toString(_Id),
            GoldChainConstants.SVG_END
        ));
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {   
        require(tokenId < _nextTokenId, TokenDoesNotExist());     
        return string(abi.encodePacked(
            GoldChainConstants.JSON_BASE64_PREFIX,
            Base64.encode(bytes(string(abi.encodePacked(
                GoldChainConstants.JSON_START,
                Strings.toString(tokenId),
                getTraits(tokenId),
                Base64.encode(bytes(genSVG(tokenId))),
                GoldChainConstants.JSON_END
            ))))
        ));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, GoldChainERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
