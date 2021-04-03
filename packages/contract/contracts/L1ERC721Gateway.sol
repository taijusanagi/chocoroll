// SPDX-License-Identifier: MIT
// @unsupported: ovm
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {OVM_L1ERC721Gateway} from "./ovm/OVM_L1ERC721Gateway.sol";

contract L1ERC721Gateway is OVM_L1ERC721Gateway {
    constructor(
        address _l1ERC721Address,
        address _l2DepositedERC721,
        address _l1messenger
    ) OVM_L1ERC721Gateway(_l1ERC721Address, _l2DepositedERC721, _l1messenger) {}
}
