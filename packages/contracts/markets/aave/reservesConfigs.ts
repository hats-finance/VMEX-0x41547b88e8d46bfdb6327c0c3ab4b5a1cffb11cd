import { eContractid, IReserveParams } from '../../helpers/types';

import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyStableThree,
  rateStrategyWETH,
  rateStrategyAAVE,
  rateStrategyCurve,
  rateStrategyVolatileOne,
  rateStrategyVolatileTwo,
  rateStrategyVolatileThree,
  rateStrategyVolatileFour,
} from './rateStrategies';

export const strategyBUSD: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: '0',
  liquidationThreshold: '0',
  liquidationBonus: '0',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0, //0 is enum for Aave
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '1000',
};

export const strategyDAI: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '8000',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '1000000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '1000',
};

export const strategySUSD: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: '0',
  liquidationThreshold: '0',
  liquidationBonus: '0',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '2000',
};

export const strategyTUSD: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '8000',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '1000',
};

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyStableThree,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '0', //this means there is no cap
  borrowCap: '0', 
  borrowFactor: '10010', //100% for now
  reserveFactor: '1000',
};

export const strategyUSDT: IReserveParams = {
  strategy: rateStrategyStableThree,
  baseLTVAsCollateral: '0',
  liquidationThreshold: '0',
  liquidationBonus: '0',
  borrowingEnabled: true,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '1000',
};

export const strategyAAVE: IReserveParams = {
  strategy: rateStrategyAAVE,
  baseLTVAsCollateral: '5000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '1000',
};

export const strategyBAT: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '7000',
  liquidationThreshold: '7500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '12000', //100% for now
  reserveFactor: '2000',
};

export const strategyENJ: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '5500',
  liquidationThreshold: '6000',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '13000', //100% for now
  reserveFactor: '2000',
};

export const strategyWETH: IReserveParams = {
  strategy: rateStrategyWETH,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8250',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '1000', //10 weth for testing
  borrowCap: '800', //1,000,000
  borrowFactor: '10100', //100% for now
  reserveFactor: '1000',
};

export const strategyKNC: IReserveParams = {
  strategy: rateStrategyVolatileTwo,
  baseLTVAsCollateral: '6000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '14000', //100% for now
  reserveFactor: '2000',
};

export const strategyLINK: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '7000',
  liquidationThreshold: '7500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '12000', //100% for now
  reserveFactor: '2000',
};

export const strategyMANA: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '6000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '13000', //100% for now
  reserveFactor: '3500',
};

export const strategyMKR: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '6000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '12000', //100% for now
  reserveFactor: '2000',
};

export const strategyREN: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '5500',
  liquidationThreshold: '6000',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '14000', //100% for now
  reserveFactor: '2000',
};

export const strategySNX: IReserveParams = {
  strategy: rateStrategyVolatileThree,
  baseLTVAsCollateral: '1500',
  liquidationThreshold: '4000',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '15000', //100% for now
  reserveFactor: '3500',
};

// Invalid borrow rates in params currently, replaced with snx params
export const strategyUNI: IReserveParams = {
  strategy: rateStrategyVolatileThree,
  baseLTVAsCollateral: '6000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.DelegationAwareAToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '13000', //100% for now
  reserveFactor: '2000',
};

export const strategyWBTC: IReserveParams = {
  strategy: rateStrategyVolatileTwo,
  baseLTVAsCollateral: '7000',
  liquidationThreshold: '7500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '8',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyYFI: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '4000',
  liquidationThreshold: '5500',
  liquidationBonus: '11500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '13000', //100% for now
  reserveFactor: '2000',
};

export const strategyZRX: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '6000',
  liquidationThreshold: '6500',
  liquidationBonus: '11000',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '14000', //100% for now
  reserveFactor: '2000',
};


export const strategySTETH: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0, //this is since there is a chainlink aggregator for STETH
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyFrax: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '0', //0 means cannot be collateral
  liquidationThreshold: '0',
  liquidationBonus: '0',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0, //this is since there is a chainlink aggregator for FRAX
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '2000',
};

export const strategyBAL: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18', //checked
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '11000', //100% for now
  reserveFactor: '2000',
};

export const strategyCRV: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '12000', //100% for now
  reserveFactor: '2000',
};

export const strategyCVX: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '13000', //100% for now
  reserveFactor: '2000',
};

export const strategyBADGER: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyLDO: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyALCX: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyOneinch: IReserveParams = {
  strategy: rateStrategyVolatileFour,
  baseLTVAsCollateral: '2500',
  liquidationThreshold: '4500',
  liquidationBonus: '11500',
  borrowingEnabled: false,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  assetType: 0,
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyCurveV1LPToken: IReserveParams = {
  strategy: rateStrategyCurve,
  baseLTVAsCollateral: '2500', //change
  liquidationThreshold: '4500',//change
  liquidationBonus: '11500', //change
  borrowingEnabled: false,
  reserveDecimals: '18', //this is the important information
  aTokenImpl: eContractid.AToken,
  assetType: 1, //1 is enum for Curve
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10050', //100% for now
  reserveFactor: '2000',
};


export const strategyCurveV2LPToken: IReserveParams = {
  strategy: rateStrategyCurve,
  baseLTVAsCollateral: '2500', //change
  liquidationThreshold: '4500',//change
  liquidationBonus: '11500', //change
  borrowingEnabled: false,
  reserveDecimals: '18', //this is the important information
  aTokenImpl: eContractid.AToken,
  assetType: 2, //1 is enum for Curve
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};

export const strategyYearnToken: IReserveParams = {
  strategy: rateStrategyCurve,
  baseLTVAsCollateral: '2500', //change
  liquidationThreshold: '4500',//change
  liquidationBonus: '11500', //change
  borrowingEnabled: false,
  reserveDecimals: '18', //this is the important information
  aTokenImpl: eContractid.AToken,
  assetType: 3, //3 is enum for yearn
  supplyCap: '10000', 
  borrowCap: '10000', 
  borrowFactor: '10100', //100% for now
  reserveFactor: '2000',
};