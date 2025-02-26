import { http, createPublicClient, encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
import { createSmartAccountClient } from 'permissionless';
import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { abi } from './utils.js'; //import the contract's abi from the utils.js file

// Set this to the Node RPC URL obtained in Step 1.
const rpcUrl =
  'https://api.developer.coinbase.com/rpc/v1/base/1f18dPnADjvOkKdbafGNz9SdRM2Qy6yv';

// Set the address for the Smart Account Factory contract on the Base network.
const BASE_FACTORY_ADDRESS = '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232';

// Set the address for the Entrypoint Contract on Base.
const BASE_ENTRYPOINT_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

//Set the address for the target smart contract(s)
const targetContract = '0x83bd615eb93eE1336acA53e185b03B54fF4A17e8';

const publicClient = createPublicClient({
  chain: base,
  transport: http(rpcUrl),
});

const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
  // Set this to your private key
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
  entryPoint: process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS,
});

const cloudPaymaster = createPimlicoPaymasterClient({
  chain: base,
  transport: http(rpcUrl),
  entryPoint: BASE_ENTRYPOINT_V06,
});

const smartAccountClient = createSmartAccountClient({
  account: simpleAccount,
  chain: base,
  bundlerTransport: http(rpcUrl),
  // IMPORTANT: Set up Cloud Paymaster to sponsor your transaction
  middleware: {
    sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
  },
});

const callData = encodeFunctionData({
  abi: abi,
  functionName: 'mintTo',
  args: [smartAccountClient.account.address],
});

async function sendTransactionFromSmartAccount() {
  try {
    const txHash = await smartAccountClient.sendTransaction({
      account: smartAccountClient.account,
      to: targetContract,
      data: callData,
      value: 0n,
    });

    console.log('✅ Transaction successfully sponsored!');
    console.log(`🔍 View on Etherscan: https://basescan.org/tx/${txHash}`);
  } catch (error) {
    console.log('Error sending transaction: ', error);
  }
}

sendTransactionFromSmartAccount();
