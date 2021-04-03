// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {OVM_L2DepositedERC721} from "./ovm/OVM_L2DepositedERC721.sol";

contract L2ERC721 is OVM_L2DepositedERC721 {
    constructor(
        address _l2CrossDomainMessenger,
        string memory _name,
        string memory _symbol
    ) OVM_L2DepositedERC721(_l2CrossDomainMessenger, _name, _symbol) {}
}
