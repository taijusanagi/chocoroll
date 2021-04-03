// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract L1ERC721 is ERC721 {
    constructor(string name, string symbol) {
        _mint(msg.sender, 1);
    }
}
