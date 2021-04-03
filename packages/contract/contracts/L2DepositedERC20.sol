// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {OVM_L2DepositedERC20} from "@eth-optimism/contracts/build/contracts/OVM/bridge/tokens/OVM_L2DepositedERC20.sol";

contract L2DepositedERC20 is OVM_L2DepositedERC20 {
    constructor(
        address _l2CrossDomainMessenger,
        string memory _name,
        string memory _symbol
    ) OVM_L2DepositedERC20(_l2CrossDomainMessenger, _name, _symbol) {}
}
