// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IDataStorage.sol";
import "./NFTGoldChain.sol";

/**
 * @title GoldChain
 * @author Mathieu TUDELA
 * @dev Allows registered jewelers to deliver digital certificates
 */
contract GoldChain is AccessControl, GoldChainERC721 {

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
    /// @notice the token does not exist
    error TokenDoesNotExist();

    /* ::::::::::::::: MODIFIERS :::::::::::::::::: */

    /* ::::::::::::::: FUNCTIONS :::::::::::::::::: */

    function createCustomer(
        string calldata _name,
        string calldata _email,
        string calldata _location
        ) external returns (bool) {
            if (hasRole(CUSTOMERS_ROLE, msg.sender)) {
                revert CustomerIsAlreadyRegistered();
            }
            _grantRole(CUSTOMERS_ROLE, msg.sender);
            dataStorage.addCustomer(
                msg.sender, 
                _name, 
                _email, 
                _location,
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
        _safeMint(msg.sender, _nextTokenId);
        return true;
    }

    function updateCustomer(
        string calldata _name,
        string calldata _email,
        string calldata _location,
        bool _visible
    ) external onlyRole(CUSTOMERS_ROLE) returns (bool) {
        dataStorage.updateCustomer(
            msg.sender, 
            _name, 
            _email, 
            _location,
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

    function transertCertificate(address _to, uint256 _tokenId) external returns (bool) {
        _transfer(msg.sender, _to, _tokenId);
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
        emit jewelerActivated(_jewelerAddress, block.timestamp);
        return true;
    }

    function desactivateJeweler(address _jewelerAddress) external onlyRole(ADMIN) returns (bool) {
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

    function getTraits(uint _Id) override internal view returns (string memory) {   
        IDataStorage.Certificate memory cert = dataStorage.getOneCertificate(_Id);             
        string memory o=string(abi.encodePacked(tr1,cert.JewelerName,tr2,cert.materials[0],tr3,cert.gemStones[0]));
        return string(abi.encodePacked(o,tr4,Strings.toString(cert.weightInGrams),tr5,cert.mainColor,tr6,cert.level,tr7));
    }

    function genSVG(uint _Id) override internal pure returns (string memory) {

        string memory output = string(abi.encodePacked());
        output = string(abi.encodePacked(if0,if1,if2,if3,if4));
        output = string(abi.encodePacked(output,if5,if6,if7,if8));
        output = string(abi.encodePacked(output,if9,if10,if11,if12));
        output = string(abi.encodePacked(output,if4,if14,if15));
        return string(abi.encodePacked(output,if4,Strings.toString(_Id),if18));
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {   
        require(tokenId < _nextTokenId, TokenDoesNotExist());     
        return string(abi.encodePacked(rl4,Base64.encode(bytes(string(abi.encodePacked(rl1,Strings.toString(tokenId),getTraits(tokenId),Base64.encode(bytes(genSVG(tokenId))),rl3))))));
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
