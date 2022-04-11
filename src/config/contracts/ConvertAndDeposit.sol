// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface WETH9 {
  function deposit() external payable;

  function transfer(address dst, uint256 wad) external returns (bool);
}

contract ConvertAndDeposit {
  address wrappedTokenContract;

  constructor(address wrappedNativeAssetContractAddress) {
    wrappedTokenContract = wrappedNativeAssetContractAddress;
  }

  function depositAndTransfer(address depositAddress) public payable {
    WETH9(wrappedTokenContract).deposit{value: msg.value}();
    WETH9(wrappedTokenContract).transfer(depositAddress, msg.value);
  }
}
