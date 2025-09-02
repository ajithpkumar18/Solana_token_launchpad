import './App.css'
import LaunchPad from './LaunchPad'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {

  return (
    <>
      <ConnectionProvider endpoint='https://api.devnet.solana.com'>
        <WalletProvider wallets={[]}>
          <WalletModalProvider>
            <WalletMultiButton />
            <LaunchPad />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}

export default App
