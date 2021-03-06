// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

/* Interface Imports */

import {iOVM_L1ERC721Gateway} from "./iOVM_L1ERC721Gateway.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/* Library Imports */
import {Abs_L2DepositedERC721} from "./Abs_L2DepositedERC721.sol";

/**
 * @title OVM_DepositedERC721
 * @dev The Deposited ERC721 is an ERC721 implementation which represents assets deposited on the other side of an Optimistic bridge.
 * This contract mints new tokens when it hears about deposits into the corresponding gateway.
 * This contract also burns the tokens intended for withdrawal, informing the gateway to release funds.
 *
 * NOTE: This contract implements the Abs_L2DepositedERC721 contract using OpenZeppelin's ERC20 as the implementation.
 * Alternative implementations can be used in this similar manner.
 *
 * Compiler used: optimistic-solc
 * Runtime target: OVM, EVM
 */
contract OVM_L2DepositedERC721 is Abs_L2DepositedERC721, ERC721 {
    /***************
     * Constructor *
     ***************/

    /**
     * @param _messenger Cross-domain messenger used by this contract.
     * @param _name ERC721 name
     * @param _symbol ERC721 symbol
     */
    constructor(
        address _messenger,
        string memory _name,
        string memory _symbol
    ) Abs_L2DepositedERC721(_messenger) ERC721(_name, _symbol) {}

    // When a withdrawal is initiated, we burn the withdrawer's token to prevent subsequent usage.
    function _handleInitiateWithdrawal(
        address, // _to,
        uint256 _tokenId
    ) internal override {
        _burn(_tokenId);
    }

    // When a deposit is finalized, we mint a new token to the designated account
    function _handleFinalizeDeposit(
        address _to,
        uint256 _tokenId,
        string memory _tokenURI
    ) internal override {
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }
}
