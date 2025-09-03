import './App.css'
import LaunchPad from './LaunchPad';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {

  return (
    <>
      <ConnectionProvider endpoint='https://api.devnet.solana.com'>
        <WalletProvider wallets={[]}>
          <WalletModalProvider>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <LaunchPad />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}

export default App
