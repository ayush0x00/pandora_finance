# Pandora Finance

## Code structure

This repo contains implementation of tokenizing link using ERC721 standards. The contract for managing token is present in [Asset.sol](contracts/Asset.sol)
A simple react-app is also provided for interaction with blockchain. The code for react app is present in [client](client) directory.

## Features

- A user can mint new token of his own. For the present implementation, every token has a **tokenId** (simple index based) and a **tokenValue** (link of item which user want to tokenize)
- The user can trade the ownership of a particular token using its tokenId. Once a token has been traded with other person, the user will no longer be able to view the link which the token was holding. The new user becomes the sole properitor of the token.
- A user can get the link related to his/her token by using the **Get Value** functionality of the app. **User can only get the link of the tokens owned by him**

## Usage details

Currently the contract has been deployed on the rinkeby test network whose **contract address** is `0xd144Fd660b9C9d322848b8Ec9AD678D56cD7ffF2`.

For deploying the contract:-

- Make sure you have `Truffle` and `Metamask` install
- Do `npm install` in the root directory
- Create a `.env` file in the root directory whose content will be `MNEMONIC="<YOUR_SEED_GOES_HERE>"`. Place the seed value provided by metamask wallet as string.
- Type the command in the terminal root directory

```Bash
truffle compile
truffle migrate -f 2 --network rinkeby --reset
```

- For deploying on ganache, after compiling the contract run ganache and type `truffle migrate --reset` on the terminal.

- This will compile the contract, create the build in `client/build` directory and migrate the contract on the rinkeby test network.

For starting the client side:-

- Migrate to `client` directory

```Bash
npm install
npm start
```

- This should launch the react app. Make sure the address on the right side of the nav bar is same as yours metamask wallet.
- You can now mint new tokens, trade them and get their corresponding values.
