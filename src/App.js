import { useState } from 'react';
import {ethers} from 'ethers'
import './App.css';
import { TEST_TOKEN_ABI, TEST_TOKEN_ADDRESS } from './constants';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [mintAmount, setMintAmount] = useState('');


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // to write we need to bring signer and create instance to change the state
        const signer = await provider.getSigner();
        // create instance of the contract
        const contractInstance = new ethers.Contract(TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, signer);
        setContract(contractInstance);
        console.log("contract set", contractInstance);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0])
        
        console.log("Connnected account: ", accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.log('MetaMask not detected');
    }
  };

  // const getBalance = async () => {
  //   if(contract) {
  //     try {
  //       const userBalance = await contract.getUserBalance();
  //       setBalance(ethers.formatEther(userBalance)); //convert form wei
  //     } catch (err) {
  //       console.error('Error getting balance:', err);
  //     }
  //   }
  // };

  const getBalance = async () => {
    if (contract) {
      try {
        const userBalance = await contract.getUserBalance();
        setBalance(ethers.formatEther(userBalance)); // convert from wei to ETH-like display
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  };

const handleMint = async () => {
  if (contract && mintAmount) {
    try {
      const amountInWei = ethers.parseEther(mintAmount);
      const tx = await contract.mint(amountInWei);
      await tx.wait();
      alert("Mint Successful!");
      getBalance();
    } catch(error) {
      console.error("Error minting tokens:", error);
      alert("Mint Failed!");
    }
  }
};

  return (
   <>
   <div className="App">
      <header className="App-header">
        <h1>Connect to MetaMask</h1>
        {account ? (
          <>
            <p>Connected Account: {account}</p>
            <button onClick={getBalance}>Get Balance</button>
            {balance && <p>Token Balance: {balance} STT</p>}

            <div>
              <input
                type='number'
                placeholder='Amount to Mint'
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)} 
              />
               <button onClick={handleMint}>Mint Tokens</button>
            </div>
          </>
          // <p>Connected Account: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
   </div>
   </>
  );
}

export default App;
