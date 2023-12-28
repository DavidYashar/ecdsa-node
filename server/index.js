const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
// const { toHex } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());


const balances = {
  //private: 08a9eb537e7d3fc253b0ebd52ea8aaf9e6d64cdea1ec835b187fad37f87c886b
  "02e6caf7c88980c4539b26f3d7eebba82a49d80777316e4c308a63e187438945fa": 10, 
  //private: 90e870fec835035374145d077fb050b9c139d8385357809387ca9122546878c0
  "02412e656b816531cbc1bf20e19ac664d54b05a7eefc008500bdf51f82684de650": 70,
   //private: 11598c8a8b44634215bde030c1dd615c19e93188cef86e992b9640183fc69c9c
  "03e0301989f671afe1833a57784ac3ac6d37f5b99cd65c6639f36bc8cb66fae450": 75,
};

app.get("/balance/:address", (req, res) => {
  let { address } = req.params;
 

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signed, hashed, publicKey, amount, recipient } = req.body;

  let hashedobj = Object.values(hashed)
  let hashedd = new Uint8Array(hashedobj)
  let sign = { r: BigInt(signed.r), s: BigInt(signed.s) }

 
    let validate = secp.secp256k1.verify(sign, hashedd, publicKey);
    

    if(validate) {
      setInitialBalance(publicKey);
      setInitialBalance(recipient);

    if (balances[publicKey] < amount) {
    res.send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey], message: "transaction successful" });
    console.log(balances[publicKey])
  }

    } else {
      res.send(' invalid signature')
    }
 
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  
  if (!balances[address]) {
    balances[address] = 0;
  }
}
