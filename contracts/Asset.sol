pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Asset is ERC721{
  string[] public asset;
  mapping(string=>bool) assetExists;

  constructor() ERC721("Ayush asset","AT") public{ }

  function totalSupply() public view returns (uint){
    return asset.length;
  }

  function getAsset(uint _tokenId) public view returns(string memory){
    require(_isApprovedOrOwner(msg.sender,_tokenId),"Only owner can view the content");
    return asset[_tokenId];
  }

  function mint(string memory _asset) public{
    require(!assetExists[_asset]);
    asset.push(_asset);
    uint id= asset.length -1;
    _mint(msg.sender,id);
    assetExists[_asset]=true;
  }

  function trade(address _to, uint _tokenId) public{
    _transfer(msg.sender,_to,_tokenId);
  }

}
