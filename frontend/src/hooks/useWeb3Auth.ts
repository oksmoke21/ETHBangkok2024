import { useState, useEffect, useCallback } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from 'ethers';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';

export function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // ETH Mainnet
            rpcTarget: "https://rpc.ankr.com/eth",
          },
        });

        await web3auth.initModal();
        setWeb3auth(web3auth);

        if (web3auth.connected) {
          const web3authProvider = await web3auth.connect();
          setProvider(web3authProvider);
          const ethersProvider = new ethers.providers.Web3Provider(web3authProvider!);
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

  const connect = useCallback(async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized");
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    
    if (web3authProvider) {
      const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
      const signer = ethersProvider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      setIsConnected(true);
    }
  }, [web3auth]);

  const disconnect = useCallback(async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized");
    }
    await web3auth.logout();
    setProvider(null);
    setAddress('');
    setIsConnected(false);
  }, [web3auth]);

  return {
    web3auth,
    provider,
    address,
    isConnected,
    connect,
    disconnect
  };
} 