'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from 'ethers';

interface Web3AuthContextType {
	web3auth: Web3Auth | null;
	provider: any;
	address: string;
	isConnected: boolean;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	getSigner: () => Promise<ethers.Signer>;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
	const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
	const [provider, setProvider] = useState<any>(null);
	const [address, setAddress] = useState<string>('');
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const init = async () => {
			try {
				const web3auth = new Web3Auth({
					clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
					web3AuthNetwork: "testnet",
					chainConfig: {
						chainNamespace: CHAIN_NAMESPACES.EIP155,
						chainId: "0x13881", // Mumbai testnet
						rpcTarget: "https://rpc-mumbai.maticvigil.com",
					},
				});

				await web3auth.initModal();
				setWeb3auth(web3auth);

				if (web3auth.connected) {
					const provider = web3auth.provider;
					setProvider(provider);
					const ethersProvider = new ethers.providers.Web3Provider(provider!);
					const signer = ethersProvider.getSigner();
					const addr = await signer.getAddress();
					setAddress(addr);
					setIsConnected(true);
				}
			} catch (error) {
				console.error(error);
			}
		};

		init();
	}, []);

	const connect = async () => {
		if (!web3auth) {
			throw new Error("web3auth not initialized");
		}
		const provider = await web3auth.connect();
		setProvider(provider);
		
		if (provider) {
			const ethersProvider = new ethers.providers.Web3Provider(provider);
			const signer = ethersProvider.getSigner();
			const addr = await signer.getAddress();
			setAddress(addr);
			setIsConnected(true);
		}
	};

	const disconnect = async () => {
		if (!web3auth) {
			throw new Error("web3auth not initialized");
		}
		await web3auth.logout();
		setProvider(null);
		setAddress('');
		setIsConnected(false);
	};

	const getSigner = async () => {
		if (!provider) {
			throw new Error("Provider not initialized");
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		return ethersProvider.getSigner();
	};

	return (
		<Web3AuthContext.Provider 
			value={{
				web3auth,
				provider,
				address,
				isConnected,
				connect,
				disconnect,
				getSigner
			}}
		>
			{children}
		</Web3AuthContext.Provider>
	);
}

export function useWeb3Auth() {
	const context = useContext(Web3AuthContext);
	if (!context) {
		throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
	}
	return context;
}
