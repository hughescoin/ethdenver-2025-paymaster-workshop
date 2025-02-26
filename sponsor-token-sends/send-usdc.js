import { createWalletClient, http, createPublicClient } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { createBundlerClient } from 'viem/account-abstraction';
import { createSmartAccount } from '../sponsor-nft-mint/create-smart-wallet.js';
import { abi } from './token/abi.js';

const externalAccount = privateKeyToAccount(process.env.PRIVATE_KEY);
console.log('Account established from private key: ', externalAccount.address);

//create wallet client
const walletClient = createWalletClient({
  account: externalAccount,
  chain: base,
  transport: http(),
});

const smartAccount = await createSmartAccount();
console.log('Smart account created: ', smartAccount.address);

//send USDC to smart account

const amountToSend = 50000; // $0.05 | USDC uses 6 decimals

const sentUsdcToSmartAccount = await walletClient.writeContract({
  address: process.env.USDC_ADDRESS,
  abi: abi,
  functionName: 'transfer',
  args: [smartAccount.address, amountToSend],
});

console.log(
  `USDC sent to smart account: https://basescan.org/tx/${sentUsdcToSmartAccount}`
);

//send USDC to external account
const amountToSendBack = 25000; // $0.05 | USDC uses 6 decimals
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
});

export const bundlerClient = createBundlerClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
  paymaster: true,
});

const { maxFeePerGas, maxPriorityFeePerGas } =
  await publicClient.estimateFeesPerGas();

const hash = await bundlerClient.sendUserOperation({
  account: smartAccount,
  calls: [
    {
      abi: abi,
      functionName: 'transfer',
      to: process.env.USDC_ADDRESS,
      args: [externalAccount.address, amountToSendBack],
    },
  ],
  maxFeePerGas,
  maxPriorityFeePerGas,
});

console.log(
  `USDC sent to ${externalAccount.address} from ${smartAccount.address}: https://base.blockscout.com/op/${hash}`
);
