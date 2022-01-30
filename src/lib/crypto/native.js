const secp256k1 = require("secp256k1-native");
const assert = require("assert");

const receiverPublicKey = "Apelq06rFggANt+EOpDnuMipvLt6q2opsD9XehVt7kWq";

console.log("receiverPublicKey :>> ", receiverPublicKey);

const senderPrivateKey =
  "725a647cba72546b1882e91bb12ff393de8e72a6505d215e225416bb60c4c656";

console.log("senderPrivateKey :>> ", senderPrivateKey);

const ctx = secp256k1.secp256k1_context_create(
  secp256k1.secp256k1_context_SIGN
);

const sharedSecret = Buffer.alloc(32);

const point = Buffer.from(receiverPublicKey, "base64");

const scalar = Buffer.from(senderPrivateKey, "hex");

const pubkey64 = Buffer.alloc(64);

secp256k1.secp256k1_ec_pubkey_parse(ctx, pubkey64, point);

secp256k1.secp256k1_ecdh(ctx, sharedSecret, pubkey64, scalar, null);

console.log("sharedSecrect :>> ", sharedSecret.toString("hex"));
console.log("sharedSecrect.length :>> ", sharedSecret.length);

assert.strictEqual(
  sharedSecret.toString("hex"),
  "fcc3027a3f8fa88f01cc887458a985de3a92224b21ecb7bbdc3ebfb457ac1655"
);
