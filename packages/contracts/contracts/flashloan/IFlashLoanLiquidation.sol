// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;


interface IFlashFloanLiquidation {

	function flashLoanCall(
		address collateralAsset, 
		address debtAsset,
		uint64 trancheId, 
		address user, 
		uint256 amountDebt) external; 
}
