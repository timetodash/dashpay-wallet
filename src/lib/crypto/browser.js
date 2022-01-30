const secp256k1 = require("secp256k1/elliptic");
const assert = require("assert");

const receiverPublicKey = "Apelq06rFggANt+EOpDnuMipvLt6q2opsD9XehVt7kWq";

console.log("receiverPublicKey :>> ", receiverPublicKey);

const senderPrivateKey =
  "725a647cba72546b1882e91bb12ff393de8e72a6505d215e225416bb60c4c656";

console.log("senderPrivateKey :>> ", senderPrivateKey);

const point = Buffer.from(receiverPublicKey, "base64");

const scalar = Buffer.from(senderPrivateKey, "hex");

// get X point of ecdh
const ecdhPointX = secp256k1.ecdh(point, scalar, {}, Buffer.alloc(32));

console.log("sharedSecret", ecdhPointX.toString("hex"));

console.log("sharedSecret.length", ecdhPointX.length);

assert.strictEqual(
  ecdhPointX.toString("hex"),
  "fcc3027a3f8fa88f01cc887458a985de3a92224b21ecb7bbdc3ebfb457ac1655"
);
