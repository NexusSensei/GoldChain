// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library GoldChainConstants {
    // ROLES
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant JEWELERS_ROLE = keccak256("JEWELERS_ROLE");
    bytes32 public constant CUSTOMERS_ROLE = keccak256("CUSTOMERS_ROLE");
    bytes32 public constant CERTIFICATOR_ROLE = keccak256("CERTIFICATOR_ROLE");

    // SVG Constants
    string public constant SVG_HEADER = '<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">';
    string public constant SVG_BACKGROUND = '<rect x="0" y="0" width="800" height="800" fill="#f8f9fa" stroke="#d4af37" stroke-width="10" rx="20" ry="20"/>';
    string public constant SVG_TITLE_START = '<text x="50%" y="120" font-size="50" font-family="Arial, sans-serif" font-weight="bold" fill="#333" text-anchor="middle">';
    string public constant SVG_TITLE_2 = '<text x="50%" y="180" font-size="40" font-family="Arial, sans-serif" font-weight="bold" fill="#333" text-anchor="middle">';
    string public constant SVG_TITLE_TEXT = "Certificat NFT";
    string public constant SVG_TITLE_END = '</text>';
    string public constant SVG_RING_1 = '<ellipse cx="400" cy="420" rx="180" ry="100" fill="none" stroke="#d4af37" stroke-width="20"/>';
    string public constant SVG_RING_2 = '<ellipse cx="400" cy="420" rx="140" ry="80" fill="none" stroke="#f8f9fa" stroke-width="20"/>';
    string public constant SVG_DIAMOND_1 = '<polygon points="400,250 470,300 470,380 400,430 330,380 330,300" fill="white" stroke="#8a6f30" stroke-width="5"/>';
    string public constant SVG_DIAMOND_2 = '<line x1="400" y1="250" x2="400" y2="430" stroke="#8a6f30" stroke-width="3"/>';
    string public constant SVG_DIAMOND_3 = '<line x1="330" y1="300" x2="470" y2="380" stroke="#8a6f30" stroke-width="3"/>';
    string public constant SVG_DIAMOND_4 = '<line x1="470" y1="300" x2="330" y2="380" stroke="#8a6f30" stroke-width="3"/>';
    string public constant SVG_BRAND_START = '<text x="50%" y="600" font-size="40" font-family="Arial, sans-serif" font-weight="bold" fill="#d4af37" text-anchor="middle">';
    //string public constant SVG_BRAND_TEXT = 'GoldChain';
    //string public constant SVG_BRAND_END = '</text>';
    string public constant SVG_FRAME = '<rect x="200" y="650" width="400" height="80" fill="white" stroke="#333" stroke-width="3" rx="10" ry="10"/>';
    string public constant SVG_NUMBER_START = '<text x="50%" y="700" font-size="30" font-family="Arial, sans-serif" fill="#333" text-anchor="middle">';
    string public constant SVG_END = '</svg>';

    // JSON Constants
    string public constant JSON_START = '{"name": "GoldChain Certificate NFT #';
    string public constant JSON_END = '"}';
    string public constant JSON_BASE64_PREFIX = 'data:application/json;base64,';
    string public constant JSON_JEWELER_NAME = '", "attributes": [{"trait_type": "JewelerName","value": "';
    string public constant JSON_MATERIAL = '"},{"trait_type": "mainMaterial","value": "';
    string public constant JSON_GEMSTONE = '"},{"trait_type": "mainGemStones","value": "';
    string public constant JSON_WEIGHT = '"},{"trait_type": "weightInGrams","value": "';
    string public constant JSON_COLOR = '"},{"trait_type": "description","value": "';
    string public constant JSON_LEVEL = '"},{"trait_type": "CertificateLevel","value": "';
    string public constant JSON_IMAGE = '"}],"image": "data:image/svg+xml;base64,';
} 