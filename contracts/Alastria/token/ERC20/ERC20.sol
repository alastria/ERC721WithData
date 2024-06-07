// SPDX-License-Identifier: MIT
// Alastria Contracts (last updated v0.0.1) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;

import {ERC20} from "../../../OpenZeppelin/token/ERC20/ERC20.sol";
import {Ownable} from "../../../OpenZeppelin/access/Ownable.sol";

contract AlastriaERC20 is ERC20, Ownable {

    constructor(string memory name, string memory symbol, uint256 initialBalance) ERC20(name, symbol) Ownable(msg.sender) {
        mint(msg.sender, initialBalance);
    }

    function mint(address account, uint256 value) public onlyOwner {
        super._mint(account, value);
    }

    function burn(address account, uint256 value) public onlyOwner {
        super._burn(account, value);
    }
}