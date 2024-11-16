require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.20",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			}
		]
	},
	networks: {
		// hardhat: {
		// 	forking: {
		// 		url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
		// 		blockNumber: 6091784 // specific block number for reduced load
		// 	},
		// 	chainId: 11155111
		// },
		sepolia: {
			url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [process.env.DEV_PRIVATE_KEY]
		},
		polygon_mainnet: {
			url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [process.env.DEV_PRIVATE_KEY]
		},
		polygon_amoy_testnet: {
			url: `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [process.env.DEV_PRIVATE_KEY]
		},
	},
	defender: {
		apiKey: process.env.DEFENDER_API_KEY_TESTNET,
		apiSecret: process.env.DEFENDER_API_SECRET_TESTNET,
	},
	gasReporter: {
		enabled: true,
		currency: "USD"
	},
	// namedAccounts: {
	// 	owner: {
	// 		default: 0,
	// 	}
	// },
	contractSizer: {
		alphaSort: true,
		disambiguatePaths: false,
		runOnCompile: true,
		strict: true
	},
	etherscan: {
		apiKey: process.env.POLYGONSCAN_API_KEY
		// apiKey: process.env.ETHERSCAN_API_KEY
	},
	mocha: {
		timeout: 200000 // 200 seconds
	}
};
