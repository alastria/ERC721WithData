// SPDX-License-Identifier: MIT
// Alastria Contracts (last updated v0.0.1) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.24;

import {ERC721} from "../../../OpenZeppelin/token/ERC721/ERC721.sol";
import {Ownable} from "../../../OpenZeppelin/access/Ownable.sol";

struct ERC721Data {
  string storedHash;
  uint256 number;
}

contract AlastriaERC721StructData is ERC721, Ownable {
    mapping (uint256 => ERC721Data) tokenData;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(_msgSender()) {
    }

    function mint(uint256 tokenId, ERC721Data memory data) public onlyOwner {
        mintTo(_msgSender(), tokenId, data);
    }

    function mintTo(address to, uint256 tokenId, ERC721Data memory data) public onlyOwner {
        super._safeMint(to, tokenId);
        tokenData[tokenId] = data;
    }

    function burn(uint256 tokenId) public onlyOwner {
        super._burn(tokenId);
        delete tokenData[tokenId];
    }

    function transfer(address to, uint256 tokenId) public {
        super.safeTransferFrom(_msgSender(), to, tokenId);
    }

    function getData(uint256 tokenId) public view returns(ERC721Data memory) {
        return tokenData[tokenId];
    }

    function updateData(uint256 tokenId, ERC721Data memory data) public {
        require(_msgSender() == owner() || ownerOf(tokenId) == _msgSender(), "AlastriaERC721StructDataError: Cannot update data of token not owned by us.");
        tokenData[tokenId] = data;
    }
}
