import server from "./server";

import * as secp from 'ethereum-cryptography/secp256k1';
import  {toHex} from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    let privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
    address =toHex(secp.secp256k1.getPublicKey(privateKey)) 
    
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setAddress(address);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        privateKey
        <input placeholder="Type your privateKey " value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="address">Address: <br /> {address}</div>
  
    </div>
  );
}

export default Wallet;
