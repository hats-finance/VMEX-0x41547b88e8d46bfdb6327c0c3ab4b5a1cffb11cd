// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {UserLiquidationLogic} from "../analytics-utilities/user/UserLiquidationLogic.sol"; 
//actual aave implementations
import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol"; 
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol"; 
//vmex lending pool
import {ILendingPool} from "../interfaces/ILendingPool.sol"; 
import {IERC20} from "../dependencies/openzeppelin/contracts/IERC20.sol"; 

contract FlashLoanLiquidation is FlashLoanSimpleReceiverBase { 
	
	ILendingPool internal lendingPool; //vmex 
	IPoolAddressesProvider internal constant aaveAddressesProvider = 
		IPoolAddressesProvider(0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e); 
	
	//NOTE: this is aave's address provider, and VMEX's lending pool
	constructor(ILendingPool _lendingPool) FlashLoanSimpleReceiverBase(aaveAddressesProvider) { 
		lendingPool = _lendingPool; 
	}


	//checkUpkeep --> performUpkeep --> flashloanCall --> executeOperation 
	function executeOperation(
    	address asset,
    	uint256 amount,
    	uint256 premium,
    	address initiator,
    	bytes calldata params
	) external override returns (bool){
	
	
	//TODO check if borrowed asset is what we need, do swaps as necessary

	FlashLoanData memory decodedParams = abi.decode(params, (FlashLoanData)); 

	//vmex liquidation			
	lendingPool.liquidationCall(
		decodedParams.collateralAsset,
		decodedParams.debtAsset,
		decodedParams.trancheId,
		decodedParams.user,
		decodedParams.debtAmount,
		false //no vToken
	); 

	uint amountOwing = amount + premium; 
    IERC20(asset).approve(address(POOL), amountOwing);


	return true; 
  }

	struct FlashLoanData {
		address collateralAsset;  
		address debtAsset;
		uint64 trancheId; 
		address user;
		uint256 debtAmount; 		
	}
	
	//
	function flashLoanCall(
		address collateralAsset, 
		address debtAsset,
		uint64 trancheId, 
		address user, 
		uint256 amountDebt) public {

		bytes memory params = abi.encode(FlashLoanData({
			collateralAsset: collateralAsset,
			debtAsset: debtAsset,
			trancheId: trancheId,
			user: user,
			debtAmount: amountDebt})
		); 

		POOL.flashLoanSimple(
			address(this), //receiver
			debtAsset, //we pay down debt so we need the flashloan in the debt asset? 
			amountDebt, 
			params, 
			0 //referral code
		); 
  }


	function _liquidate() internal {
		//unused for now but can move liquidation logic here if needed
	}
		
}
