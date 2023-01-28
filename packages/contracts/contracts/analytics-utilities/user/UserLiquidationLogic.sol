// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0; 

import { QueryUserHelpers } from "../libs/QueryUserHelpers.sol";
import { LendingPoolConfigurator } from "../../protocol/lendingpool/LendingPoolConfigurator.sol";
import { ILendingPoolAddressesProvider } from "../../interfaces/ILendingPoolAddressesProvider.sol";
import {ILendingPool} from "../../interfaces/ILendingPool.sol"; 
import {IFlashFloanLiquidation} from "../../flashloan/IFlashLoanLiquidation.sol"; 


contract UserLiquidationLogic {
		
	uint64 internal totalTranches; 
	address internal addressProvider; 
	address internal lendingPool;
	IFlashFloanLiquidation internal flashLoanLiquidation; 

	struct LiquidationParams {
		address collateralAsset;
		address debtAsset; 
		uint256 debtAmount; 
	}

	struct TrancheData {
		uint64 id; //id is the same as index in this case 
		uint256 availableBorrowsETH; 
	}

	constructor(address _addressProvider, address _lendingPool, IFlashFloanLiquidation _flashLoanLiquidation) {
		addressProvider = _addressProvider; 
		lendingPool = _lendingPool; 
		flashLoanLiquidation = _flashLoanLiquidation; 
        totalTranches = LendingPoolConfigurator(
            ILendingPoolAddressesProvider(_addressProvider).getLendingPoolConfigurator()
        ).totalTranches();
	}	


	function liquidateUser(address user) external {
		//collateralAsset - underlying token we are liquidating 
		//debtAsset - underlying borrowed asset to be repaid
		//trancheID 
		//user - address of user being liquidated
		//debtToCover - amount of borrowed asset we are repaying 
		//receiveAToken - bool, yes or no? 
				
		//first, we want to check which tranches are liquidatable
		TrancheData[] memory activeTranches = getActiveTranches(user); 
		for (uint64 i = 0; i < activeTranches.length; i++) {
			LiquidationParams memory params = 
				getUserPositionDataPerTranche(user, i, activeTranches[i].availableBorrowsETH);

			//flashloan here? 
			flashLoanLiquidation.flashLoanCall(
				params.collateralAsset, 
				params.debtAsset, 
				activeTranches[i].id, 
				user, 
				params.debtAmount //token amount of debt, not usd
			);
		}
	}
		

	function getActiveTranches(address user) 
		internal view returns (TrancheData[] memory trancheData) {	

		trancheData = new TrancheData[](totalTranches); 	

		//array of tranches that user is deposited into
        QueryUserHelpers.UserTrancheData[] memory userTrancheData = 
			new QueryUserHelpers.UserTrancheData[](totalTranches); 

        for (uint64 i = 0; i < totalTranches; i++) {
			userTrancheData[i] = QueryUserHelpers.getUserTrancheData(user, i, addressProvider);
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
		uint256 availableBorrowsETH
	) internal view returns (LiquidationParams memory liqParams) {
		(QueryUserHelpers.SuppliedAssetData[] memory supplyArray, 
		QueryUserHelpers.BorrowedAssetData[] memory borrowArray, ) = 
			QueryUserHelpers.getUserAssetData(
				user, 
				trancheID, 
				addressProvider, 
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
