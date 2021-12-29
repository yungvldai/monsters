// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC721Tradable.sol";

contract Monster is ERC721Tradable {
  constructor(address _proxyRegistryAddress) ERC721Tradable("Monster", "MON", _proxyRegistryAddress) {}

  function baseTokenURI() override public pure returns (string memory) {
    return "https://mosaic.monster/api/v1/monsters/";
  }
}