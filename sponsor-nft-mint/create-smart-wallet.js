//Create a smart wallet
import 'dotenv/config';
import { toCoinbaseSmartAccount } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function createSmartAccount() {
  const owner = privateKeyToAccount(process.env.PRIVATE_KEY);

  const smartAccount = await toCoinbaseSmartAccount({
    client,
    owners: [owner],
  });

  return smartAccount;
}
