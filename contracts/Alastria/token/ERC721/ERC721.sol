// SPDX-License-Identifier: MIT
// Alastria Contracts (last updated v0.0.1) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.721;

import {ERC721} from "../../../OpenZeppelin/token/ERC721/ERC721.sol";
import {Ownable} from "../../../OpenZeppelin/access/Ownable.sol";

contract AlastriaERC721 is ERC721, Ownable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
    }

    function mint(address account, uint256 tokenId) public onlyOwner {
        super._safeMint(account, tokenId);
    }

    function burn(address account, uint256 tokenId) public onlyOwner {
        super._burn(account, tokenId);
    }
}
