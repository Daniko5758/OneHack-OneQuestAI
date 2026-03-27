import { createClient } from '@supabase/supabase-js';
import { SuiClient } from '@onelabs/sui/client';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';

// 1. Setup Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 2. Setup RPC OneChain Testnet
export const suiClient = new SuiClient({
  url: 'https://rpc-testnet.onelabs.cc:443',
});

// 3. Setup Wallet Relayer dari Mnemonic
export const relayerKeypair = Ed25519Keypair.deriveKeypair(process.env.RELAYER_MNEMONIC!);