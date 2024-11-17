// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract IPLawyers {

    struct Lawyer {
        uint8 kycId;
        lawyerType speciality;
        uint8 ongoingVals;
    }

    // Architect not just for lawyers but law firms too

    uint256 public patentLawyersCounter;
    uint256 public copyrightLawyersCounter;
    uint256 public trandemarkLawyersCounter;

    mapping (address lawyer => Lawyer lawyerDetails) public lawyers;

    enum lawyerType {
        // 
    }


    function registerLawyer() external {
        // push to mapping
        // increment relevant counter
    }

    function unregisterLawyer() external {
        // delete from mapping
        // decrement relevant counter
    }

}