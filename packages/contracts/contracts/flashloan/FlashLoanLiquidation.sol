// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {UserLiquidationLogic} from "../analytics-utilities/user/UserLiquidationData.sol"; 
//actual aave implementations
import {FlashLoanReceiverBase} from "../dependencies/aavev08/FlashLoanReceiverBase.sol";
import {ILendingPoolAddressesProvider} from "../dependencies/aavev08/ILendingPoolAddressProvider.sol";

//vmex lending pool
import {ILendingPool} from "../interfaces/ILendingPool.sol"; 
import {IERC20} from "../dependencies/openzeppelin/contracts/IERC20.sol"; 


contract FlashLoanLiquidation is FlashLoanReceiverBase {

	ILendingPool internal lendingPool; 
		
	//NOTE: this is aave's address provider, and VMEX's lending pool 	
	constructor(ILendingPoolAddressesProvider _addressProvider, ILendingPool _lendingPool) FlashLoanReceiverBase(_addressProvider) {
		lendingPool = _lendingPool; 
	}		

	//checkUpkeep --> performUpkeep --> flashloanCall --> executeOperation
	function executeOperation(
  	  address[] calldata assets,
  	  uint[] calldata amounts,
  	  uint[] calldata premiums,
  	  address initiator,
  	  bytes calldata params
  	) external override returns (bool) {

	//custom logic goes here
	//check if borrowed asset is already the one we need	
	
	FlashLoanData memory decodedParams = abi.decode(params, (FlashLoanData)); 

	//do liquidation here
	lendingPool.liquidationCall(
		decodedParams.collateralAsset,
		decodedParams.debtAsset,
		decodedParams.trancheId,
		decodedParams.user,
		decodedParams.debtAmount,
		false //no vToken
	); 


	for (uint i = 0; i < assets.length; i++) {
		uint amountOwing = amounts[i] + premiums[i];
		IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
	}


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
			
		address[] memory assets = new address[](1); 			
		uint256[] memory amounts = new uint256[](1); 	
		uint256[] memory modes = new uint256[](1); 
		assets[0] = debtAsset; 
		amounts[0] = amountDebt; 
		modes[0] = 0; 


		bytes memory params = abi.encode(FlashLoanData({
			collateralAsset: collateralAsset,
			debtAsset: debtAsset,
			trancheId: trancheId,
			user: user,
			debtAmount: amountDebt})
		); 

		LENDING_POOL.flashLoan(
			address(this), //receiver
			assets,
			amounts, 
			modes,	
			address(this), //onBehalfOf
			params, 
			0
		); 
  }


	function _liquidate() internal {
	}
		
}
