import 'dotenv/config';
import { http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import {
  toCoinbaseSmartAccount,
  createBundlerClient,
} from 'viem/account-abstraction';
import { abi } from './utils.js';

const nftAddress = '0x83bd615eb93eE1336acA53e185b03B54fF4A17e8';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
});

export const bundlerClient = createBundlerClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
  paymaster: true,
});

// Create the base account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
console.log(`account: ${account.address}`);

// Create smart account
const smartAccount = await toCoinbaseSmartAccount({
  client: publicClient,
  owners: [account],
});

console.log(`smartAccount: ${smartAccount.address}`);

const { maxFeePerGas, maxPriorityFeePerGas } =
  await publicClient.estimateFeesPerGas();

const hash = await bundlerClient.sendUserOperation({
  account: smartAccount,
  calls: [
    {
      abi: abi,
      functionName: 'mintTo',
      to: nftAddress,
      args: [smartAccount.address],
    },
  ],
  maxFeePerGas,
  maxPriorityFeePerGas,
});

console.log(
  `NFT minted to ${smartAccount.address}: https://base.blockscout.com/op/${hash}`
);
