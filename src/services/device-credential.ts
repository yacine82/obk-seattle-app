
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const DEVICE_CREDENTIAL_KEY =
  'obk-jumuah-device-credential-v1';

export async function getDeviceCredential(): Promise<string> {
  const existing = await SecureStore.getItemAsync(
    DEVICE_CREDENTIAL_KEY
  );

  if (existing) {
    return existing;
  }

  const credential = Crypto.randomUUID();

  await SecureStore.setItemAsync(
    DEVICE_CREDENTIAL_KEY,
    credential
  );

  return credential;
}

export async function getDeviceCredentialHash(): Promise<string> {
  const credential = await getDeviceCredential();

  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    credential
  );
}
