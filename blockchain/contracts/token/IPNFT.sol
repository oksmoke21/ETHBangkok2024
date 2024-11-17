// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Admin} from "../governance/Admin.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";

contract ERC721Core is ERC721 {
    // Custom URI? Since domain might be updated later

    Admin internal admin;
    address internal s_issuer;

    // Optional mapping for token URIs
    mapping(uint256 tokenId => string) private _tokenURIs;

    event SetIssuer(address indexed issuer);

    error ERC721Core_CallerIsNotIssuerOrItself(address msgSender);

    modifier onlyIssuerOrItself() {
        // Itself i.e address(this) is because of CCIP
        if (msg.sender != address(this) && msg.sender != s_issuer) {
            revert ERC721Core_CallerIsNotIssuerOrItself(msg.sender);
        }
        _;
    }

    // Used as the URI for all token types by relying on ID substitution, e.g. https://token-cdn-domain/{id}.json
    constructor(string memory uri_, address adminIPSphere) ERC721(uri_) {
        admin = AdminIPSphere(adminIPSphere);
    }

    function mint(address _to, uint256 _id, uint256 _amount, bytes memory _data, string memory _tokenUri) public onlyIssuerOrItself{
        // Checks data from IPOracle.sol if basic valuation data is filled or not, NFT has not already been minted, etc
        
        // Crosscheck with issuer.sol in work workspace

        _mint(_to, _id, _amount, _data);
        _tokenURIs[_id] = _tokenUri;
    }

    function burn(address account, uint256 id, uint256 amount) public onlyIssuerOrItself {
        if (account != _msgSender() && !isApprovedForAll(account, _msgSender())) {
            revert ERC721MissingApprovalForAll(_msgSender(), account);
        }

        _burn(account, id, amount);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        return bytes(tokenURI).length > 0 ? tokenURI : super.uri(tokenId);
    }

    function _setURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }
}