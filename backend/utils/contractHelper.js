import { ethers } from 'ethers';
import { getProvider } from '../utils/blockchainHelper.js';

const provider = getProvider();

const createContractInstance = (contractAddress, contractABI) => {
	const contract = new ethers.Contract(contractAddress, contractABI, provider);
	return contract;
};

export default createContractInstance;
