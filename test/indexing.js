const Asset = artifacts.require("Asset.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Asset", (accounts) => {
  let contract;

  before(async () => {
    contract = await Asset.deployed();
  });

  describe("indexing", async () => {
    it("list assets", async () => {
      await contract.mint("#fded");
      await contract.mint("#fffv");
      await contract.mint("#fjnj");
      const totalSupply = await contract.totalSupply();
      let asset;
      let result = [];
      for (var i = 0; i < totalSupply; i++) {
        asset = await contract.getAssetValue(i);
        result.push(asset);
      }
      let expected = ["#fded", "#fffv", "#fjnj"];
      assert.equal(expected.join(","), result.join(","));
    });
    it("should not return value for not owner", async () => {
      await contract.mint("#fdeded");
      await contract.trade(accounts[1], 0, { from: accounts[0] });
      await contract.getAssetValue("#fdeded").should.be.rejected;
    });
  });
});
