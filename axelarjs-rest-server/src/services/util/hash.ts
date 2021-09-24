import { SHA256 } from 'jscrypto/SHA256';
import { Base64 } from 'jscrypto/Base64';

/**
 * Calculates the transaction hash from Amino-encoded string.
 * @param txData Amino-encoded string (base64)
 */
export const hashAmino = (txData: string): string => {
	return SHA256.hash(Base64.parse(txData)).toString().toUpperCase();
}
