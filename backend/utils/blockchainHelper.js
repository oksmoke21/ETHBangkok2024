import { ethers } from 'ethers';
import { config } from 'dotenv';
config();

let providerInstance = null;
let signerInstance = null;
let walletInstance = null;

export const getProvider = () => {
	if (!providerInstance) {
		providerInstance = new ethers.JsonRpcProvider(process.env.RPC_URL);
	}
	return providerInstance;
};

export const getWallet = () => {
	if (!walletInstance) {
		if (!process.env.PRIVATE_KEY) {
			throw new Error('No private key set in environment variables');
		}
		walletInstance = new ethers.Wallet(process.env.PRIVATE_KEY, getProvider());
	}
	return walletInstance;
};

export const getSigner = () => {
	if (!signerInstance) {
		signerInstance = getWallet().connect(getProvider());
	}
	return signerInstance;
};
