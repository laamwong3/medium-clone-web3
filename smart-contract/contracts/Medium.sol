//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error Medium__Not_enough_money();
error Medium__Fail_to_transfer_ether();

contract Medium is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;
    uint256 private fees;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _fees
    ) ERC721(_name, _symbol) {
        fees = _fees;
    }

    function safeMint(address _to, string calldata _uri) external payable {
        if (msg.value < fees) revert Medium__Not_enough_money();
        (bool success, ) = payable(owner()).call{value: fees}("");
        if (!success) revert Medium__Fail_to_transfer_ether();
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
