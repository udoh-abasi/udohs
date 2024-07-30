import crypto from "crypto";

export const encryptText = (plainText: string) => {
  // Create a cipher
  const myCipher = crypto.createCipheriv(
    process.env.CRYPTO_ALGORITHM as string,
    process.env.CRYPTO_KEY as string, // The secret key. NOTE: The length must be 32
    process.env.CRYPTO_IV as string // The IV (Initialization vector). NOTE: The length must be 16
  );

  // Update the cipher with the plainText. 'utf-8' means the text is 'utf-8' encoded, while 'hex' means we want outputted string to be 'hex' encoded
  let encryptedText = myCipher.update(plainText, "utf-8", "hex");

  // This returns the final encrypted data. We passed in 'hex' as the encoding type, so that a string with encoding type 'hex', will be returned, instead of a buffer
  const finalCipher = myCipher.final("hex");

  return (encryptedText += finalCipher);
};

//

export const decryptText = (encryptedText: string) => {
  // Create a decipher
  const myDecipher = crypto.createDecipheriv(
    process.env.CRYPTO_ALGORITHM as string,
    process.env.CRYPTO_KEY as string, // The secret key. NOTE: The length must be 32
    process.env.CRYPTO_IV as string // The IV (Initialization vector). NOTE: The length must be 16
  );

  // Update the cipher with the encrypted text. 'hex' means the text is 'hex' encoded, while 'ut-8' means we want outputted string to be 'utf-8'
  let decryptedText = myDecipher.update(encryptedText, "hex", "utf-8");

  // This returns the final decrypted data. We passed in 'hex' as the encoding type, so that a string with encoding type 'hex', will be returned, instead of a buffer
  const finalCipher = myDecipher.final("utf-8");

  return (decryptedText += finalCipher);
};
