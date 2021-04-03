// SPDX-License-Identifier: MIT
// @unsupported: ovm
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {OVM_L1ERC721Gateway} from "./ovm/OVM_L1ERC721Gateway.sol";
import {iOVM_ERC20} from "@eth-optimism/contracts/build/contracts/iOVM/precompiles/iOVM_ERC20.sol";

contract L1ERC20Gateway is OVM_L1ERC20Gateway {
    constructor(
        iOVM_ERC20 _l1ERC20,
        address _l2DepositedERC20,
        address _l1messenger
    ) OVM_L1ERC20Gateway(_l1ERC20, _l2DepositedERC20, _l1messenger) {}
}
