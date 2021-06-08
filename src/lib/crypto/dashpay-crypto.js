/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
const CryptoJS = require('crypto-js');
// const secp256k1 = require('secp256k1-native');
const dashcore = require('@dashevo/dashcore-lib');

// const ecdhSharedKey = (senderPrivateKey, receiverPublicKey) => {
//   const ctx = secp256k1.secp256k1_context_create(secp256k1.secp256k1_context_SIGN);

//   const sharedSecrect = Buffer.alloc(32);

//   const point = Buffer.from(receiverPublicKey, 'base64');

//   const scalar = Buffer.from(senderPrivateKey, 'hex');

//   const pubkey64 = Buffer.alloc(64);

//   secp256k1.secp256k1_ec_pubkey_parse(ctx, pubkey64, point);

//   secp256k1.secp256k1_ecdh(ctx, sharedSecrect, pubkey64, scalar, null);

//   return sharedSecrect.toString('hex');
// };

const encryptCBCAES256 = (data, secret) => {
  const key = CryptoJS.enc.Hex.parse(secret);

  const cipher = CryptoJS.AES.encrypt(data, key, {
    // iv: CryptoJS.enc.Hex.parse('a2b46306d0474332b28c0e247017bcc5'),
    iv: CryptoJS.lib.WordArray.random(16),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return cipher;
};

const decryptCBCAES256 = (encrypted, secret) => {
  const key = CryptoJS.enc.Hex.parse(secret);

  const iv = CryptoJS.enc.Hex.parse(encrypted.slice(0, 16).toString('hex'));

  const ciphertext = CryptoJS.enc.Hex.parse(encrypted.slice(16, encrypted.length).toString('hex'));

  const encryptedCP = CryptoJS.lib.CipherParams.create({
    ciphertext,
  });

  return CryptoJS.AES.decrypt(encryptedCP, key, { iv });
};

const encryptPublicKey = (publicKey, sharedSecrect) => {
  const data = CryptoJS.enc.Hex.parse(publicKey);

  const cipher = encryptCBCAES256(data, sharedSecrect);

  const ciphertext = cipher.ciphertext.toString(CryptoJS.enc.Hex);

  console.log('ciphertext :>> ', ciphertext, Buffer.from(ciphertext, 'hex').length);

  const iv = cipher.iv.toString(CryptoJS.enc.Hex);

  console.log('iv :>> ', iv);

  const ciphertextBuffer = Buffer.from(ciphertext, 'hex');

  const ivBuffer = Buffer.from(iv, 'hex');

  return Buffer.concat([ivBuffer, ciphertextBuffer]).toString('hex');
};

const decryptPublicKey = (encryptedPublicKey, sharedSecrect) => decryptCBCAES256(Buffer.from(encryptedPublicKey, 'hex'), sharedSecrect).toString(CryptoJS.enc.Hex);

const encryptAccountLabel = (label, sharedSecrect) => {
  const labelBuffer = Buffer.from(label, 'utf8');

  console.log('labelBuffer.length :>> ', labelBuffer.length);

  const paddingBuffer = 31 - labelBuffer.length > 0 ? Buffer.alloc(31 - labelBuffer.length) : Buffer.alloc(0);

  const paddedLabelBuffer = Buffer.concat([paddingBuffer, labelBuffer]);

  const cipher = encryptCBCAES256(paddedLabelBuffer.toString('utf8'), sharedSecrect);

  console.log('paddedLabelBuffer.length :>> ', paddedLabelBuffer.length, 'utf8', paddedLabelBuffer.toString('utf8'));

  const ciphertext = cipher.ciphertext.toString(CryptoJS.enc.Hex);

  console.log('ciphertext :>> ', ciphertext, Buffer.from(ciphertext, 'hex').length);

  const iv = cipher.iv.toString(CryptoJS.enc.Hex);

  console.log('iv :>> ', iv);

  const ciphertextBuffer = Buffer.from(ciphertext, 'hex');

  const ivBuffer = Buffer.from(iv, 'hex');

  return Buffer.concat([ivBuffer, ciphertextBuffer]).toString('base64');
};

const decryptAccountLabel = (encryptedAccountLabel, sharedSecrect) => decryptCBCAES256(Buffer.from(encryptedAccountLabel, 'base64'), sharedSecrect).toString(CryptoJS.enc.Utf8);

const createAccountReference = (senderPrivateKey, extendedPublicKey, accountIndex = 0, version = 0) => {
  const senderPrivateKeyBuffer = Buffer.from(senderPrivateKey, 'hex');

  const extendedPublicKeyBuffer = Buffer.from(extendedPublicKey, 'hex');

  const ASK = dashcore.crypto.Hash.sha256hmac(senderPrivateKeyBuffer, extendedPublicKeyBuffer);

  console.log('ASK :>> ', ASK);

  const ASK32 = ASK.slice(0, 4);

  console.log('ASK32 :>> ', ASK32.toString('hex'));

  const ASK28 = parseInt(ASK32.toString('hex'), 16) >> 4;

  console.log('ASK28 :>> ', ASK28);

  const shortenedAccountBits = accountIndex & 0x0FFFFFFF;

  console.log('shortenedAccountBits :>> ', shortenedAccountBits);

  const versionBits = version << 28;

  console.log('versionBits :>> ', versionBits);

  const accountReference = versionBits | (ASK28 ^ shortenedAccountBits);

  console.log('accountReference :>> ', accountReference);

  return accountReference;
};

const deriveExtendedPublicKeyDIP15 = (senderHDPrivateKey, senderIdentityId, receiverIdentityId) => {
  // TODO re enable 256bit derivation
  const senderIdentityIdHex = 1 //dashcore.encoding.Base58.decode(senderIdentityId).toString('hex');
  // const senderIdentityIdHex = dashcore.crypto.Hash.sha256(Buffer.from('01', 'hex')).toString('hex');

  const receiverIdentityIdHex = 1 //dashcore.encoding.Base58.decode(receiverIdentityId).toString('hex'); // receiverIdentity.id.toString('hex');
  // const receiverIdentityIdHex = dashcore.crypto.Hash.sha256(Buffer.from('02', 'hex')).toString('hex');

  const extendedPublicKey = senderHDPrivateKey.deriveChild(`m/9'/5'/15'/0'/0x${senderIdentityIdHex}/0x${receiverIdentityIdHex}`).hdPublicKey;

  const receivingAddress = dashcore.Address(extendedPublicKey.publicKey, 'testnet').toString();

  console.log('receivingAddress :>> ', receivingAddress);

  const extendedPublicKeyDIP15Buffers = Buffer.concat([extendedPublicKey._buffers.parentFingerPrint, extendedPublicKey._buffers.chainCode, extendedPublicKey._buffers.publicKey]);

  console.log('extendedPublicKeyDIP15Buffers.toString(hex) :>> ', extendedPublicKeyDIP15Buffers.toString('hex'));

  return extendedPublicKeyDIP15Buffers.toString('hex');
};

module.exports = {
  encryptCBCAES256, decryptCBCAES256, encryptPublicKey, decryptPublicKey, encryptAccountLabel, decryptAccountLabel,
  // ecdhSharedKey,
  createAccountReference, deriveExtendedPublicKeyDIP15,
};
