// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract L1ERC721 is ERC721 {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        mint();
    }

    function mint() public {
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
    }
}
