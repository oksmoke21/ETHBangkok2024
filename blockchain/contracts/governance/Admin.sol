//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Admin contract with owner-only functions to adjust contract-wide parameters
 */
contract Admin is Ownable, Pausable, ReentrancyGuard {
	// Blacklist controller
	address public complianceManager;

	// IP NFT token issuer
	address public issuanceManager;

	event TokenizationFeeUpdated(uint256 newTokenizationFee);
	event MarketplaceFeeUpdated(uint256 newMarketplaceFee);	
	event OracleFeeUpdated(uint256 newOracleFee);
	event ComplianceManagerUpdated(address oldComplianceManager, address newComplianceManager);
	event IssuanceManagerUpdated(address oldIssuer, address newIssuer);
	event Blacklisted(address indexed blacklistedAddress);
	event Unblacklisted(address indexed unblacklistedAddress);

	/**
	 * @notice Mapping that checks whether an address is blacklisted for regulatory and KYC/AML compliance.
	 * Blacklisted addresses cannot participate further in the ecosystem and marketplace
	 */
	mapping(address => bool) private blacklists;

	/**
	 * @notice The maximum duration of any loan started on this platform,
		measured in seconds.
	 */
	uint256 public maximumLoanDuration = 53 weeks;

	/**
	 * @notice The maximum number of active loans allowed on this platform.
		This parameter is used to limit the risk that we face while
	 	the project is first getting started.
	 */
	uint256 public maximumNumberOfActiveLoans = 100;

	/**
	 * @notice The percentage of interest earned by lenders on this platform
		that is taken by the contract admin's as a fee, measured in
	 	basis points (hundreths of a percent).
	 */
	uint256 public adminFeeInBasisPoints = 25;
	
	/**
	 * @notice The amount in USD charged by the IP Valuation oracle service
		that is taken by the contract admin's as a fee, measured in
	 	basis points (hundreths of a percent).
	 */
	uint256 public valuationFeePatent = 1000;
	uint256 public valuationFeeCopyright = 800;
	uint256 public valuationFeeDesign = 500;
	uint256 public valuationFeeTrademark = 750;

	/* CONSTRUCTOR */
	constructor() Ownable(msg.sender) { }

	
    function setIssuer(address _issuanceManager) external onlyOwner {
        emit IssuanceManagerUpdated(issuanceManager, _issuanceManager);
        issuanceManager = _issuanceManager;
    }

	/**
	 * @dev Updates the compliance manager address.
	 * @param _newComplianceManager The new compliance manager address.
	 */
	function setComplianceManager(address _newComplianceManager) public {
		require(msg.sender == complianceManager || msg.sender == owner(), "only ComplianceManager or Owner");
		emit ComplianceManagerUpdated(complianceManager, _newComplianceManager);
		complianceManager = _newComplianceManager;
	}

	// ! Set inference in tokenization contract? Don't think its required
	modifier onlyComplianceManager() {
		require(msg.sender == complianceManager, "[IPSphere]: Caller is not compliance manager");
		_;
	}

	/**
	 * @dev Adds an address to the contract's blacklist, preventing it from participating in contract interactions.
	 * @param _blacklistAddress The address to be blacklisted.
	 * @notice Can only be called by the contract owner.
	 * @notice Emits a {Blacklisted} event.
	 */
	function blacklist(address _blacklistAddress) external onlyComplianceManager {
			blacklists[_blacklistAddress] = true;
			emit Blacklisted(_blacklistAddress);
	}

	/**
	 * @dev Removes an address from the contract's blacklist, allowing it to participate in contract interactions again.
	 * @param _unblacklistAddress The address to be removed from the blacklist.
	 * @notice Can only be called by the contract owner.
	 * @notice Emits an {Unblacklisted} event.
	 */
	function unblacklist(address _unblacklistAddress) external onlyComplianceManager {
			blacklists[_unblacklistAddress] = false;
			emit Unblacklisted(_unblacklistAddress);
	}

	// TODO: Apart from blacklist and unblacklist, compliance manager should be able to raise ticket for re-issuance of IP NFT in case of loss/theft

	/**
	 * @dev Ensures that a function cannot be called by blacklisted addresses.
	 */
	function isBlacklisted(address _address) public view returns (bool) {
		return blacklists[_address];
	}

	/**
	 * @notice This function can be called by admins to change the
		maximumLoanDuration. Note that they can never change
	 	maximumLoanDuration to be greater than UINT32_MAX, since that's
	 	the maximum space alotted for the duration in the loan struct.
	 * @param  _newMaximumLoanDuration - The new maximum loan duration, measured in seconds.
	 */
	function updateMaximumLoanDuration(uint256 _newMaximumLoanDuration) external onlyOwner {
		require(_newMaximumLoanDuration <= uint256(~uint32(0)), "loan duration cannot exceed space alotted in struct");
		maximumLoanDuration = _newMaximumLoanDuration;
	}

	/**
	 * @notice This function can be called by admins to change the maximumNumberOfActiveLoans.
	 * @param  _newMaximumNumberOfActiveLoans - The new maximum number of
		active loans, used to limit the risk that we face while the
	 	project is first getting started.
	 */
	function updateMaximumNumberOfActiveLoans(uint256 _newMaximumNumberOfActiveLoans) external onlyOwner {
		maximumNumberOfActiveLoans = _newMaximumNumberOfActiveLoans;
	}

	/**
	 * @notice This function can be called by admins to change the percent of
		interest rates earned that they charge as a fee on loans. Note that
	 	newAdminFee can never exceed 10,000, since the fee is measured
	 	in basis points.
	 * @param  _newAdminFeeInBasisPoints - The new admin fee measured in basis points. This
	 	is a percent of the interest paid upon a loan's completion that
	 	go to the contract admins.
	 */
	function updateAdminFee(uint256 _newAdminFeeInBasisPoints) external onlyOwner {
		require(_newAdminFeeInBasisPoints <= 10000, "Basis points cannot exceed 10000 by definition");
		adminFeeInBasisPoints = _newAdminFeeInBasisPoints;
		emit MarketplaceFeeUpdated(_newAdminFeeInBasisPoints);
	}
}
