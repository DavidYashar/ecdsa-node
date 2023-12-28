import { useState } from "react";
import server from "./server";
import wallet from './Wallet';

import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

import  {toHex} from 'ethereum-cryptography/utils';
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [message, setmessage] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);




  async function transfer(evt) {
    evt.preventDefault();
    let hashed =  keccak256(utf8ToBytes(`Transfer issue: sender: ${address} recipient: ${recipient}, amount: ${sendAmount}`));
    let signed = secp.secp256k1.sign(hashed, privateKey);
     signed = { r: signed.r.toString(), s: signed.s.toString() };
   
    let publicKey = toHex(secp.secp256k1.getPublicKey(privateKey))
    try {
        const response = await server.post(`send`, {
        hashed: hashed,
        signed: signed,
        publicKey: publicKey,
        amount: parseInt(sendAmount), 
        recipient,
      });
      const balance = response.data.balance;
      setBalance(balance);
      
      setmessage(response.data.message)
      setTimeout(() => {
        setmessage("")
      }
      , 5000)
    } catch (ex) {
      alert("the error is: "+ ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input onClick={() =>setIsSubmit(!isSubmit)} type="button" className="button" value="Transfer" />

      {isSubmit &&
       <div className="message" >
        <h3>Transfer log:</h3>
        <strong>sender:</strong> {address} <br /><br></br>
       <strong>recipient:</strong>  {recipient} <br /><br></br>
       <strong>amount:</strong>  {sendAmount} <br />
        <button type="submit" >SEND</button>
        </div>}

        <p>{message}</p>
    </form>
  );
}

export default Transfer;
