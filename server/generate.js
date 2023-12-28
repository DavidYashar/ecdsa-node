const crypto = require('crypto');
const { toHex } = require('ethereum-cryptography/utils');
const secp = require('ethereum-cryptography/secp256k1');

const Sesp = require('@noble/secp256k1');

const privatekey = crypto.randomBytes(33);
const privateKey1 = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey1)
console.log("private key eth: " + toHex(privateKey1));
console.log("public key eth: " + toHex( publicKey ));
console.log("private key crypto : " + privatekey.toString('hex'))
// console.log("public key: " + publicKey.toString('hex'))

console.log( "hello world to hash: "+ Sesp.utils.sha256('hello world'))

