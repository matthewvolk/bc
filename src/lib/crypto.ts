const deriveKeyFromSecret = async (secretKey: string) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(16),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
};

export const encrypt = async (token: string, secretKey: string) => {
  const encoder = new TextEncoder();
  const keyMaterial = await deriveKeyFromSecret(secretKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    keyMaterial,
    encoder.encode(token),
  );

  const ivAndEncrypted = new Uint8Array(iv.length + encrypted.byteLength);
  ivAndEncrypted.set(iv, 0);
  ivAndEncrypted.set(new Uint8Array(encrypted), iv.length);

  return Buffer.from(ivAndEncrypted).toString("base64");
};

export const decrypt = async (
  encryptedTokenBase64: string,
  secretKey: string,
) => {
  const ivAndEncrypted = Uint8Array.from(
    Buffer.from(encryptedTokenBase64, "base64"),
  );

  const iv = ivAndEncrypted.slice(0, 12);
  const encrypted = ivAndEncrypted.slice(12);

  const keyMaterial = await deriveKeyFromSecret(secretKey);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    keyMaterial,
    encrypted,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
