// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Admin} from "../governance/AdminIPSphere.sol";
import {ERC721Core} from "../token/IPNFT.sol";
import {IPValuationOracle} from "../oracle/IPValuationOracle.sol";

contract IPIssuer {
    Admin internal admin;
    ERC721Core internal IPNFT;

    modifier onlyIssuer() {
        require(msg.sender == issuanceManager, "Caller must be Issuance Manager");
    }

    constructor(address _adminIPSphereContract, address _IPNFTContract) {
        admin = Admin(_adminIPSphereContract);
        IPNFT = ERC721Core(_IPNFTContract);
    }

    function beginTokenization(bytes32 ipNumber) external {
        require(!AdminIPSphere.isBlacklisted(msg.sender), "Caller address is blacklisted");
    }

    function issueIPNFT(bytes32 ipNumber) external onlyIssuer {
        IPNFT.mint();
    }

    function burnIPNFT(bytes32 ipNumber) external onlyIssuer {
        IPNFT.burn();
    }
}
