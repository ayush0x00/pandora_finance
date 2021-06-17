import React, { useState, useEffect } from "react";
import Asset from "./build/Asset.json";
import Web3 from "web3";

const Dashboard = () => {
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [assets, setAssets] = useState([]);
  const [assetValue, setAssetValue] = useState({});
  useEffect(() => {
    async function fetchData() {
      await loadWeb3();
      await loadData();
    }
    fetchData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Install metamask to continue");
    }
  };

  const loadData = async () => {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setAccount(account[0]);
    const netId = await web3.eth.net.getId();
    const networkData = Asset.networks[netId];
    const abi = Asset.abi;
    const address = networkData.address;
    const myContract = await new web3.eth.Contract(abi, address);
    setContract(myContract);
    const supply = await myContract.methods.totalSupply().call();
    console.log(supply);
    setTotalSupply(supply);
    let asset = [];
    for (var i = 0; i < supply; i++) {
      let res = await myContract.methods.getAsset(i).call();
      asset.push(res);
    }
    setAssets(asset);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    await contract.methods.mint(e.target[0].value).send({ from: account });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const transferTo = e.target[0].value;
    const tokenId = e.target[1].value;
    await contract.methods.trade(transferTo, tokenId).send({ from: account });
    setAssetValue({
      ...assetValue,
      [tokenId]: "You are not the owner of this token",
    });
  };

  const handleGetValue = async (e) => {
    e.preventDefault();
    const idx = e.target[0].value;
    try {
      const res = await contract.methods.getAssetValue(idx).call();
      setAssetValue({ ...assetValue, [idx]: res });
    } catch (e) {
      setAssetValue({
        ...assetValue,
        [idx]: "You are not the owner of this token",
      });
      alert("Only owner can view the content");
    }

    // console.log(res);
  };

  return (
    <div className="container justify-content-center">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow mb-5">
        <a className="navbar-brand" href="#">
          Ayush Asset
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <span id="account">{account}</span>
            </small>
          </li>
        </ul>
      </nav>
      <div className="d-flex flex-row mt-5 justify-content-around">
        <div className="p-2">
          <form onSubmit={handleMint}>
            <div class="form-group">
              <label for="asset">Asset link</label>
              <input
                type="text"
                class="form-control"
                id="asset"
                aria-describedby="emailHelp"
                placeholder="Enter link"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-sm btn-block">
              Mint
            </button>
          </form>
        </div>
        <div className="p-2">
          <form onSubmit={handleTransfer}>
            <div className="d-flex flex-row">
              <div class="form-group">
                <label for="transfer">Transfer ownership</label>
                <input
                  type="text"
                  class="form-control"
                  id="transfer"
                  aria-describedby="emailHelp"
                  placeholder="Address of new owner"
                />
              </div>
              <div class="form-group">
                <label for="id">Token id</label>
                <input
                  type="text"
                  class="form-control"
                  id="id"
                  aria-describedby="emailHelp"
                  placeholder="Token id to be transferred"
                />
              </div>
            </div>
            <div className="container">
              <button type="submit" class="btn btn-primary btn-sm btn-block">
                Transfer
              </button>
            </div>
          </form>
        </div>
        <div className="p-2">
          <form onSubmit={handleGetValue}>
            <div class="form-group">
              <label for="asset">Get Token Value</label>
              <input
                type="text"
                class="form-control"
                id="asset"
                aria-describedby="emailHelp"
                placeholder="Enter token id"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-sm btn-block">
              Get value
            </button>
          </form>
        </div>
      </div>
      <div className="d-flex flex-wrap mt-5 justify-content-around">
        {assets.map((a, key) => {
          return (
            <div
              className="card"
              style={{
                width: "10rem",
                height: "10rem",
                "margin-bottom": "2rem",
              }}
              key={key}
            >
              {a}
              <hr />
              {assetValue[a] && <p>{assetValue[a]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
