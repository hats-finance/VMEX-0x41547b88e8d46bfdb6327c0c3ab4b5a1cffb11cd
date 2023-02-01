// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0; 

import { QueryUserHelpers } from "../libs/QueryUserHelpers.sol";
import { LendingPoolConfigurator } from "../../protocol/lendingpool/LendingPoolConfigurator.sol";
import { LendingPoolStorage } from "../../protocol/lendingpool/LendingPoolStorage.sol";
import { ILendingPoolAddressesProvider } from "../../interfaces/ILendingPoolAddressesProvider.sol";
import {ILendingPool} from "../../interfaces/ILendingPool.sol"; 
import {FlashLoanLiquidation} from "../../flashloan/FlashLoanLiquidationV3.sol"; 
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol"; 
import {IPool} from '@aave/core-v3/contracts/interfaces/IPool.sol';

// import {IUserLiquidationLogic} from "./IUserLiquidationData.sol";
library UserLiquidationLogic {
	struct LiquidationParams {
		address collateralAsset;
		address debtAsset; 
		uint256 debtAmount; 
	}

	struct TrancheData {
		uint64 id; //id is the same as index in this case 
		uint256 availableBorrowsETH; 
	}

	function _executeOperation(
		IPool POOL,
    	address asset,
    	uint256 amount,
    	uint256 premium,
    	address initiator,
    	bytes calldata params
	) public returns (bool){
		return FlashLoanLiquidation._executeOperation(POOL, asset, amount, premium, initiator, params);
	}


	function liquidateUser(address user, ILendingPoolAddressesProvider _addressesProvider, IPool POOL) public {
		//collateralAsset - underlying token we are liquidating 
		//debtAsset - underlying borrowed asset to be repaid
		//trancheID 
		//user - address of user being liquidated
		//debtToCover - amount of borrowed asset we are repaying 
		//receiveAToken - bool, yes or no? 
				
		//first, we want to check which tranches are liquidatable
		TrancheData[] memory activeTranches = getActiveTranches(user, _addressesProvider); 
		for (uint64 i = 0; i < activeTranches.length; i++) {
			LiquidationParams memory params = 
				getUserPositionDataPerTranche(user, i, activeTranches[i].availableBorrowsETH, _addressesProvider);

			//flashloan here? 
			FlashLoanLiquidation.flashLoanCall(
				POOL,
				params.collateralAsset, 
				params.debtAsset, 
				activeTranches[i].id, 
				user, 
				params.debtAmount //token amount of debt, not usd
			);
		}
	}
		

	function getActiveTranches(address user, ILendingPoolAddressesProvider _addressesProvider) 
		internal view returns (TrancheData[] memory trancheData) {	
		uint256 totalTranches = LendingPoolConfigurator(_addressesProvider.getLendingPoolConfigurator()).totalTranches();

		trancheData = new TrancheData[](totalTranches); 	

		//array of tranches that user is deposited into
        QueryUserHelpers.UserTrancheData[] memory userTrancheData = 
			new QueryUserHelpers.UserTrancheData[](totalTranches); 

        for (uint64 i = 0; i < totalTranches; i++) {
			userTrancheData[i] = QueryUserHelpers.getUserTrancheData(user, i, address(_addressesProvider));
			if (userTrancheData[i].healthFactor < 1) {
				trancheData[i].id = i; 
				trancheData[i].availableBorrowsETH = userTrancheData[i].availableBorrowsETH; 
			}
		}

		return trancheData; 
	}


	function getUserPositionDataPerTranche(
		address user, 
		uint64 trancheID, 
		uint256 availableBorrowsETH, 
		ILendingPoolAddressesProvider _addressesProvider
	) internal view returns (LiquidationParams memory liqParams) {
		(QueryUserHelpers.SuppliedAssetData[] memory supplyArray, 
		QueryUserHelpers.BorrowedAssetData[] memory borrowArray, ) = 
			QueryUserHelpers.getUserAssetData(
				user, 
				trancheID, 
				address(_addressesProvider), 
				availableBorrowsETH
		); 
		
		//can't remember why I put a break in here but I think it's needed, guess I will figure	 it out while testing	
		for (uint256 i = 0; i < supplyArray.length; i++) {
			if (supplyArray[i].isCollateral = true) {
				liqParams.collateralAsset = supplyArray[i].asset; 
				break; 
			}
		}

		for (uint256 i = 0; i < borrowArray.length; i++) {
			liqParams.debtAsset = borrowArray[i].asset; 
			liqParams.debtAmount = borrowArray[i].amountNative; 
		}

	}	


}
