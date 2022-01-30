const secp256k1 = require("secp256k1/elliptic");
const { randomBytes } = require("crypto");

// generate privKey
function getPrivateKey() {
  while (true) {
    const privKey = randomBytes(32);
    console.log("privkey :>> ", privKey);
    console.log("privkey.length :>> ", privKey.length);
    if (secp256k1.privateKeyVerify(privKey)) return privKey;
  }
}

// generate private and public keys
const privKey = getPrivateKey();
const pubKey = secp256k1.publicKeyCreate(getPrivateKey());
console.log("pubKey :>> ", pubKey);
console.log("pubKey.length :>> ", pubKey.length);

// compressed public key from X and Y
function hashfn(x, y) {
  const pubKey = new Uint8Array(33);
  pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03;
  pubKey.set(x, 1);
  return pubKey;
}

// get X point of ecdh
const ecdhPointX = secp256k1.ecdh(
  pubKey,
  privKey,
  { hashfn },
  Buffer.alloc(33)
);
console.log(ecdhPointX.toString("hex"));
