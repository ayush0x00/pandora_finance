const Asset = artifacts.require("Asset.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Asset", (accounts) => {
  let contract;

  before(async () => {
    contract = await Asset.deployed();
  });

  describe("deployment", async () => {
    it("deployment successfull", async () => {
      const address = contract.address;
      assert.notEqual(address, null);
      assert.notEqual(address, "");
      assert.notEqual(address, undefined);
      assert.notEqual(address, 0x0);
    });
    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "Ayush asset");
    });
    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "AT");
    });
  });
});
