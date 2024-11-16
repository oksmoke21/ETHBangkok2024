// TODO: Only a helper file to easily integrate smart contract calls

"use client";

import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';

// Import contract ABI and address
import { contractHyDRAULIC } from '../../../blockchain/contract';

interface BlockchainInteractionProps { }

const BlockchainInteraction: React.FC<BlockchainInteractionProps> = () => {
    const [HyDRAULIC, setHyDRAULIC] = useState<Contract | undefined>(undefined);
    const [ipNumber, setIpNumber] = useState<string>('');
    const [ipType, setIpType] = useState<string>('0');
    const [ipValue, setIpValue] = useState<string>('');
    const [creditScore, setCreditScore] = useState<string>('');
    const [maxLoan, setMaxLoan] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { getContract } = useWeb3Auth();

    // const getContract = async (contract: any) => {
    //     const contractInstance = new ethers.Contract(
    //         contract.address,
    //         contract.abi
    //     );
    //     return contractInstance;
    // };

    // const getContract = async (contract: any) => {
    //     // Assuming you have access to a provider
    //     const provider = new ethers.getDefaultProvider(window.ethereum);
    //     const signer = provider.getSigner();
    
    //     const contractInstance = new ethers.Contract(
    //         contract.address,
    //         contract.abi,
    //         signer
    //     );
    //     return contractInstance;
    // };

    useEffect(() => {
        (async () => {
            const contract = await getContract(contractHyDRAULIC);
            console.log("HyDRAULIC")
            console.log(contract)
            if (contract instanceof Contract) {
                setHyDRAULIC(contract);
            }
            
        })();
    }, []);

    const stringToBytes = async (str: string) => {
        console.log("HyDRAULIC")
        console.log(HyDRAULIC)
        if (HyDRAULIC) {
            try {
                str = "ABC"
                console.log("HyDRAULIC Contract: ", HyDRAULIC);
                const result = await HyDRAULIC.stringToBytes(str);
                console.log("Result:", result);
                // Wait for the transaction to be mined
                console.log("Transaction mined");
            } catch (error) {
                console.error("Error converting string to bytes:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error converting string to bytes: ${error.message}`);
            }
        } else {
            console.error("HyDRAULIC contract is not initialized");
            setErrorMessage("HyDRAULIC contract is not initialized");
        }
    };

    // const stringToBytes = async (str: string) => {
    //     if (HyDRAULIC) {
    //         try {
    //             console.log("HyDRAULIC Contract: ")
    //             console.log(HyDRAULIC)
    //             const result = await HyDRAULIC.stringToBytes("abc");
    //             console.log("Result:", result);
    //         } catch (error) {
    //             console.error("Error converting string to bytes:", error);
    //             setErrorMessage(`Error converting string to bytes: ${error.message}`);
    //         }
    //     }
    // };

    const bytesToString = async (bytes: string) => {
        if (HyDRAULIC) {
            try {
                const result = await HyDRAULIC.bytesToString(bytes);
                console.log("Result:", result);
            } catch (error) {
                console.error("Error converting bytes to string:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error converting bytes to string: ${error.message}`);
            }
        }
    };

    const handleSetIPDetails = async (ipNumber: string, ipType: string) => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.setIPDetails(await stringToBytes(ipNumber), ipType);
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error setting IP details:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error setting IP details: ${error.message}`);
            }
        }
    };

    const handleTokenizeIP = async (ipNumber: string) => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.tokenizeIP(await stringToBytes(ipNumber));
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error tokenizing IP:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error tokenizing IP: ${error.message}`);
            }
        }
    };

    const handleUpdateIPValuationDetails = async (ipNumber: string, ipValue: string, creditScore: string, maxLoan: string) => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.updateIPValuationDetails(
                    await stringToBytes(ipNumber),
                    ethers.parseEther(ipValue),
                    creditScore,
                    ethers.parseEther(maxLoan)
                );
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error updating IP valuation details:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error updating IP valuation details: ${error.message}`);
            }
        }
    };

    const handleMintIP = async (ipNumber: string) => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.mintIP(await stringToBytes(ipNumber));
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error minting IP:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error minting IP: ${error.message}`);
            }
        }
    };

    const handleBurnIP = async (ipNumber: string) => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.burnIP(await stringToBytes(ipNumber));
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error burning IP:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error burning IP: ${error.message}`);
            }
        }
    };

    const handleViewIPDetails = async (ipNumber: string) => {
        if (HyDRAULIC) {
            try {
                const details = await HyDRAULIC.viewIPDetails(await stringToBytes(ipNumber));
                console.log("IP Details:", details);
            } catch (error) {
                console.error("Error viewing IP details:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error viewing IP details: ${error.message}`);
            }
        }
    };

    const handlePause = async () => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.pause();
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error pausing contract:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error pausing contract: ${error.message}`);
            }
        }
    };

    const handleUnpause = async () => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.unpause();
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error unpausing contract:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error unpausing contract: ${error.message}`);
            }
        }
    };

    const handleWithdraw = async () => {
        if (HyDRAULIC) {
            try {
                const tx = await HyDRAULIC.withdraw();
                console.log("Transaction: ", tx);
            } catch (error) {
                console.error("Error withdrawing funds:", error);
                if (error instanceof Error)
                    setErrorMessage(`Error withdrawing funds: ${error.message}`);
            }
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Blockchain Interaction
            </h1>

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" onClick={() => setErrorMessage('')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </span>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => handleSetIPDetails(ipNumber, ipType)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        setIPDetails
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <select
                        value={ipType}
                        onChange={(e) => setIpType(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="0">Patent</option>
                        <option value="1">Copyright</option>
                        <option value="2">Design</option>
                        <option value="3">Trademark</option>
                    </select>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleTokenizeIP(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        tokenizeIP
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleUpdateIPValuationDetails(ipNumber, ipValue, creditScore, maxLoan)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        updateIPValuationDetails
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="IP Value"
                        value={ipValue}
                        onChange={(e) => setIpValue(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Credit Score"
                        value={creditScore}
                        onChange={(e) => setCreditScore(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Max Loan"
                        value={maxLoan}
                        onChange={(e) => setMaxLoan(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleMintIP(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        mintIP
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleBurnIP(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        burnIP
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleViewIPDetails(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        viewIPDetails
                    </button>
                    <input
                        type="text"
                        placeholder="IP Number"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={handlePause} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        pause
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={handleUnpause} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        unpause
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={handleWithdraw} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        withdraw
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => stringToBytes(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        stringToBytes
                    </button>
                    <input
                        type="text"
                        placeholder="String"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => bytesToString(ipNumber)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        bytesToString
                    </button>
                    <input
                        type="text"
                        placeholder="Bytes32"
                        value={ipNumber}
                        onChange={(e) => setIpNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default BlockchainInteraction;