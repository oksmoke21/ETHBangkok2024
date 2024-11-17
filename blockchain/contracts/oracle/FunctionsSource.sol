// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

abstract contract FunctionsSource {
    // just contains the javascript code of chainlink functions as strings
    string public code1 = "const { ethers } = await import('npm:ethers@6.10.0');"
    "const apiResponse = await Functions.makeHttpRequest({"
    "  url: `https://ipsphere-backend-2803e1b113ab.herokuapp.com/ipValuation/getAllForms?address=0x33e3a06A9e7fA00eb6F085E0a66c44D830E9047a`,"
    "});"
    "const forms = apiResponse.data.forms;"
    "const address = forms[0].address;"
    "const ipType = forms[0].ipType;"
    "console.log(ipType)"
    "return Functions.encodeString(`ipType: ${ipType}`);";
}