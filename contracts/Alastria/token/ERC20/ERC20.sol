// SPDX-License-Identifier: MIT
// Alastria Contracts (last updated v0.0.1) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.24;

import {ERC20} from "../../../OpenZeppelin/token/ERC20/ERC20.sol";
import {Ownable} from "../../../OpenZeppelin/access/Ownable.sol";

contract AlastriaERC20 is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 initialBalance) ERC20(name, symbol) Ownable(_msgSender()) {
        mintTo(_msgSender(), initialBalance);
    }

    function mint(uint256 value) public onlyOwner {
        mintTo(_msgSender(), value);
    }

    function mintTo(address to, uint256 value) public onlyOwner {
        super._mint(to, value);
    }

    function burn(uint256 value) public onlyOwner {
        burnFrom(_msgSender(), value);
    }

    function burnFrom(address from, uint256 value) public onlyOwner {
        super._burn(from, value);
    }
}
