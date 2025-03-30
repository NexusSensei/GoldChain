// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
//import "base64-sol/base64.sol";


/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);
        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            for {
                let i := 0
            } lt(i, len) {
            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)
                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }
            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
            mstore(result, encodedLen)
        }
        return string(result);
    }
}


contract GoldChainERC721 is ERC721 {
    
    uint256 internal _nextTokenId;


    //SVG Image File
    //entête de fichier
    string internal constant if0 = '<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">';
    //fond
    string internal constant if1 = '<rect x="0" y="0" width="800" height="800" fill="#f8f9fa" stroke="#d4af37" stroke-width="10" rx="20" ry="20"/>';
    //titre
    string internal constant if2 = '<text x="50%" y="120" font-size="50" font-family="Arial, sans-serif" font-weight="bold" fill="#333" text-anchor="middle">';
    //texte du titre
    string internal constant if3 = "Certificat NFT de Bijou";
    //fin titre
    string internal constant if4 = '</text>';
    //Anneau 1
    string internal constant if5 = '<ellipse cx="400" cy="420" rx="180" ry="100" fill="none" stroke="#d4af37" stroke-width="20"/>';
    //Anneau 2
    string internal constant if6 = '<ellipse cx="400" cy="420" rx="140" ry="80" fill="none" stroke="#f8f9fa" stroke-width="20"/>';
    //diamant 1
    string internal constant if7 = '<polygon points="400,250 470,300 470,380 400,430 330,380 330,300" fill="white" stroke="#8a6f30" stroke-width="5"/>';           
    //diamant 2
    string internal constant if8 = '<line x1="400" y1="250" x2="400" y2="430" stroke="#8a6f30" stroke-width="3"/>';
    //diamant 3
    string internal constant if9 = '<line x1="330" y1="300" x2="470" y2="380" stroke="#8a6f30" stroke-width="3"/>';
    //diamant 4
    string internal constant if10 = '<line x1="470" y1="300" x2="330" y2="380" stroke="#8a6f30" stroke-width="3"/>';
    //Marque
    string internal constant if11 = '<text x="50%" y="600" font-size="40" font-family="Arial, sans-serif" font-weight="bold" fill="#d4af37" text-anchor="middle">';
    //texte de la marque
    string internal constant if12 = 'GoldChain';
    //fin titre
    //string private constant if4 = '</text>';
    //encadré
    string internal constant if14 = '<rect x="200" y="650" width="400" height="80" fill="white" stroke="#333" stroke-width="3" rx="10" ry="10"/>';
    //numéro entête
    string internal constant if15 = '<text x="50%" y="700" font-size="30" font-family="Arial, sans-serif" fill="#333" text-anchor="middle">';
    //Numéro de certificat
    //string private constant if16 = "Token ID";
    //fin numero
    //string private constant if4 = '</text>';
    //fin document
    string internal constant if18 = '</svg>';

    //JSON Attributes
    string internal constant rl1='{"name": "GoldChain Certificate NFT #';
    string internal constant rl3='"}';
    string internal constant rl4='data:application/json;base64,';
    string internal constant tr1='", "attributes": [{"trait_type": "JewelerName","value": "';
    string internal constant tr2='"},{"trait_type": "mainMaterial","value": "';
    string internal constant tr3='"},{"trait_type": "mainGemStones","value": "';
    string internal constant tr4='"},{"trait_type": "weightInGrams","value": "';
    string internal constant tr5='"},{"trait_type": "mainColor","value": "';
    string internal constant tr6='"},{"trait_type": "CertificateLevel","value": "';
    string internal constant tr7='"}],"image": "data:image/svg+xml;base64,';    


    string private constant JewelerName = "Bijoutier";
    string private constant mainMaterial = "Or 24c";
    string private constant mainGemStones = "Diamant";
    uint16 private constant weightInGrams = 8;
    string private constant mainColor = "Pink";
    string private constant CertificateLevel = "QR Code";
    /*
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
    */


    constructor()
        ERC721("GoldChainERC721", "GC")
    {  

    }

    function safeMint(address to) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    // get string attributes of properties, used in tokenURI call
    function getTraits(uint _Id) internal virtual view returns (string memory) {
        // string memory o=string(abi.encodePacked(tr1,JewelerName,tr2,mainMaterial,tr3,mainGemStones));
        // return string(abi.encodePacked(o,tr4,Strings.toString(weightInGrams),tr5,mainColor,tr6,CertificateLevel,tr7));
        return "";
    }

    function genSVG(uint _Id) internal virtual pure returns (string memory) {
        // string memory output = string(abi.encodePacked());
        // output = string(abi.encodePacked(if0,if1,if2,if3,if4));
        // output = string(abi.encodePacked(output,if5,if6,if7,if8));
        // output = string(abi.encodePacked(output,if9,if10,if11,if12));
        // output = string(abi.encodePacked(output,if4,if14,if15));
        // return string(abi.encodePacked(output,if4,Strings.toString(_Id),if18));
        return "";
    }

    function tokenURI(uint256 tokenId) override virtual public view returns (string memory) {        
        // return string(abi.encodePacked(rl4,Base64.encode(bytes(string(abi.encodePacked(rl1,Strings.toString(tokenId),getTraits(tokenId),Base64.encode(bytes(genSVG(tokenId))),rl3))))));
        return "";
    }
    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
}