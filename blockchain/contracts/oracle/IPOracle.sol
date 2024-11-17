// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./IPLawyers.sol";
import "../governance/AdminIPSphere.sol";

contract IPOracle is IPLawyers, IPPriceDetails {

    uint256 public tokenIds;
    IERC20 public USDC;
    uint256 public constant valuationFee = 0.01 * 10 ** 6; // USDC has 6 decimals. Should be generalized for USDC/USDT/etc

    enum IPType {
        patent,
        copyright,
        design,
        trademark
    }

    /**
     * @notice Struct for storing IP NFT metadata
     * @param nftTokenId TokenId of IP NFT
     * @param owner Owner address of the IP
     * @param isLoaned Flag for marking loan status
     * @param isForSale Flag for marking sale status
     * @param creditScore Credit score rating provided by valuation tool
     * @param maxLoan Maximum loan amount in USD that can be borrowed for this IP
     * @param ipValue Valuation of IP asset USD provided by valuation tool
     * @param ipType Enum IPType type representation of IP asset type
     */
    struct IP {
        uint256 nftTokenId;
        address owner;
        bool isLoaned;
        bool isForSale;
        uint16 creditScore; // uint16, because this value will never exceed 10000 (creditScore * 100)
        uint256 maxLoan;
        uint256 ipValue;
        IPType ipType;
    }

    // valuation report, lawyers associated, status and timestamp
    // actual ip data: nft, owner, isLoaned, isForSale, creditScore, maxLoan, ipValue, ipType
    // what structure for lawyers????

    // a struct for the lawyer details
    // a struct for the IP details
    // a struct for the IP valuation
    // a mapping for the IP valuation
    // a mapping for the IP details
    // a mapping for the lawyer details
    // a mapping for the valuation report


    struct IPValuation {
        uint256 valuationId;
        uint256 timestamp;
        address[] lawyers;
        mapping (address lawyer => bytes lawyerValuationData) valuationData;
        
        // Why are they required? Require valuation to be completed say within 24 hours?
        uint256 startAt;
        uint256 endAt;
        
        IPType ipType;
    }

    // Mapping that records details of an IP against the bytes32 representation of its IP number as a string
    mapping(bytes32 ipNumber => IPValuation) public Valuations;

    // Called by user when payment is made for IP Valuation
    function beginValuation(bytes32 ipNumber) external {
        // Accepts cryptocurrency (stablecoins) as payment
        // Stores lawyers' payments in escrow, transfers IPSphere's fee to contract owner

        // Checks IP Category [eg: patent]
        // Randomly choose 3 lawyers from pool of patent lawyers 
            // through an algorithm that fairly divides valuations
        
        // Mint new valuationId, with
            // a. Which IP is being valued
            // b. By which 3 lawyers
            // c. IP => (3 layers), lawyer => status & IP Val report PDF URL

        // The 3 lawyer addresses get access to IP Due Diligence backend route

        sendCLOracleRequest();

    }

    function sendCLOracleRequest() internal {
        // Integrates Chainlink Functions call
    }

    function fulfillRequest() external {
        // Receives & processes Chainlink Functions response
    }

    function submitValuation(bytes32 ipNumber) external {
        // Lawyers submit their valuation report and details for an IPNumber
        
        // Each of the lawyers submit the valuation one-by-one
        // Have to check how many of the lawyers have submitted valuation.
        // 1/3 : Submit their valuation data : Wait
        // 2/3 : Submit their valuation data : Wait
        // 3/3 : Submit their valuation data : Process valuation, call Chainlink Functions, and save data

        if (3/3) {
            postValuation()
        }
    }

    function Modify___postValuation(bytes32 ipNumber) internal {
        require(_transactionId < transactionCount, "Invalid transaction ID");

        Transaction storage transaction = transactions[_transactionId];

        require(!transaction.hasApproved[msg.sender], "Transaction already approved by this owner");
        require(!transaction.executed, "Transaction has already been executed");

        transaction.hasApproved[msg.sender] = true;
        transaction.approvals++;

        emit TransactionApproved(_transactionId, msg.sender);

        if (transaction.approvals >= minApprovals) {
            executeTransaction(_transactionId);
        }
    }


    function postValuation(bytes32 ipNumber) internal {
        // Chainlink functions integration
    }



}