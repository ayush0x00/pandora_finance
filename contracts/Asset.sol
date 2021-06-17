pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Asset is ERC721{
  uint[] public asset;
  mapping(uint=>string) private assetValue;
  mapping(string=>bool) private assetExists;

  constructor() ERC721("Ayush asset","AT") public{ }

  function totalSupply() public view returns (uint){
    uint len= asset.length;
    return len;
  }


  function getAssetValue(uint _tokenId) public view returns(string memory){
    require(_isApprovedOrOwner(msg.sender,_tokenId),"Only owner can view the content");
    return assetValue[_tokenId];
  }

  function mint(string memory _asset) public{
    require(!assetExists[_asset],"Asset already exists");
    uint id= asset.length;
    _mint(msg.sender,id);
    assetValue[id]=_asset;
    assetExists[_asset]=true;
    asset.push(id);
  }

  function trade(address _to, uint _tokenId) public{
    _transfer(msg.sender,_to,_tokenId);
  }

}
