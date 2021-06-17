import React, { useState, useEffect } from "react";
import Asset from "./build/Asset.json";
import Web3 from "web3";

const Dashboard = () => {
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [assets, setAssets] = useState([]);
  const [assetValue, setAssetValue] = useState({});
  const [mint, setMint] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [get, setGet] = useState(false);
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
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const netId = await web3.eth.net.getId();
    //console.log(netId);
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
      let res = await myContract.methods.asset(i).call();
      asset.push(res);
    }
    setAssets(asset);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      await contract.methods.mint(e.target[0].value).send({ from: account });
    } catch (e) {
      alert(e);
    }
    window.location.reload();
    setMint(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const transferTo = e.target[0].value;
    const tokenId = e.target[1].value;
    try {
      await contract.methods.trade(transferTo, tokenId).send({ from: account });
      setAssetValue({
        ...assetValue,
        [tokenId]: "You are not the owner of this token",
      });
    } catch (e) {
      alert(e);
    }
    setTransfer(false);
  };

  const handleGetValue = async (e) => {
    console.log(assetValue);
    e.preventDefault();
    const idx = e.target[0].value;
    try {
      const owner = await contract.methods.ownerOf(idx).call();
      const res = await contract.methods
        .getAssetValue(idx)
        .call({ from: account });
      setAssetValue({ ...assetValue, [idx]: res });
    } catch (e) {
      console.log(e);
      setAssetValue({
        ...assetValue,
        [idx]: "You are not the owner of this token",
      });
    }
    setGet(false);
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
            <button
              class="btn btn-primary btn-block"
              type="submit"
              onClick={() => {
                setMint(true);
              }}
            >
              {mint ? (
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Mint"
              )}
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
              <button
                class="btn btn-primary btn-block"
                type="submit"
                onClick={() => {
                  setTransfer(true);
                }}
              >
                {transfer ? (
                  <span
                    class="spinner-grow spinner-grow-sm btn-block"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Transfer"
                )}
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
            <button
              class="btn btn-primary btn-block"
              type="submit"
              onClick={() => {
                setGet(true);
              }}
            >
              {get ? (
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Get value"
              )}
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
              <p>{a}</p>
              <hr />
              {assetValue[a] && <a href={assetValue[a]}>Your link</a>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
