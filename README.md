# ETHDenver Base Sponsored Transactions with Paymaster

Paymasters are smart contracts that enable gasless transactions by allowing a third party to sponsor users' transaction fees. They eliminate the need for users to hold native cryptocurrency (like ETH) for gas fees, drastically improving user experience and increasing application engagement.

This repository demonstrates how to sponsor NFT minting and USDC transfers using a smart account.

## NFT Minting

```bash
cd sponsor-nft-mint
npm install
```

Create a `.env` file using `.env.example` as a template and populate the required fields.

You can obtain a free Paymaster URL from the Coinbase Developer Platform.

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to your chosen NFT contract address.

> [!TIP]

> **Note**: Ensure your NFT contract has a `mintTo` function in its ABI. If it uses a different function name, update it accordingly in `paymaster.js`.

Once completed, you may run the `paymaster.js` file:

```bash
node paymaster.js
```

You will see a similar output:

```bash
NFT minted to 0xBb0c1d5E7f530e8e648150fc7Cf30912575523E8: https://base.blockscout.com/op/0x638ab7429400dbfff19d92ea567a38a9f1e018e7b3d34e21d1510928feeefd34`
```

## Gasless Token Sends

Create a `.env` file using `.env.example` as a template and populate the required fields.

The example file contains the USDC address on Base but you may use any token contract of your choice.

```bash
cd sponsor-token-sends
npm install
```

Run the `send-usdc.js` file:

```bash
node send-usdc.js
```

You will see a similar output:

```bash
Account established from private key:  0xdBB7e364f026C3E974431F8366B1Ea467d5Ece9b
Smart account created:  0xD5dDA1903B5D4D9535a3921FC38B87EEb9FFA50D
USDC sent to smart account: https://basescan.org/tx/0x40362719e9efee5699a781084b27dda2432406c7ada82536b32823636faa4c2c
USDC sent to 0xdBB7e364f026C3E974431F8366B1Ea467d5Ece9b from 0xD5dDA1903B5D4D9535a3921FC38B87EEb9FFA50D: https://basescan.org/tx/0xf431ccdbc28ead8be0a6722a7318386f0a33ffe08ec2fb7963197ee60757f1bc
```
