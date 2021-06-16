const Asset = artifacts.require("Asset.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Asset", (accounts) => {
  let contract;

  before(async () => {
    contract = await Asset.deployed();
  });

  describe("minting", async () => {
    it("creates a new asset", async () => {
      const result = await contract.mint("#fff");
      const transferEvent = result.logs[0].args;
      assert.equal(transferEvent.tokenId.toNumber(), 0, "id is correct");
      assert.equal(
        transferEvent.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      assert.equal(transferEvent.to, accounts[0], "to is correct");

      await contract.mint("#fff").should.be.rejected;
    });
  });
});
