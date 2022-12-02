// import { ethers } from "ethers";
const chai = require("chai");
const { expect } = chai;
import { makeSuite } from "../test-suites/test-aave/helpers/make-suite";
import { DRE } from "../helpers/misc-utils";
import rawBRE from "hardhat";
import { BigNumber, utils } from "ethers";
import { ProtocolErrors } from '../helpers/types';
import {getCurvePrice} from "./helpers/curve-calculation";

before(async () => {
    await rawBRE.run("set-DRE");
    
    console.log("\n***************");
    console.log("DRE finished");
    console.log("***************\n");
  });
makeSuite(
    "frax3crv ",
    () => {
        const { VL_COLLATERAL_CANNOT_COVER_NEW_BORROW } = ProtocolErrors;
        const fs = require('fs');
        const contractGetters = require('../helpers/contracts-getters.ts');
        // const lendingPool = await contractGetters.getLendingPool();
        // Load the first signer
        
        const WETHadd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        const WETHabi = [
            "function allowance(address owner, address spender) external view returns (uint256 remaining)",
            "function approve(address spender, uint256 value) external returns (bool success)",
            "function balanceOf(address owner) external view returns (uint256 balance)",
            "function decimals() external view returns (uint8 decimalPlaces)",
            "function name() external view returns (string memory tokenName)",
            "function symbol() external view returns (string memory tokenSymbol)",
            "function totalSupply() external view returns (uint256 totalTokensIssued)",
            "function transfer(address to, uint256 value) external returns (bool success)",
            "function transferFrom(address from, address to, uint256 value) external returns (bool success)",
            "function deposit() public payable",
            "function withdraw(uint wad) public"
        ];

        var CurveTokenAdd = "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B"
        var CurveTokenAddabi = [
            "function allowance(address owner, address spender) external view returns (uint256 remaining)",
            "function approve(address spender, uint256 value) external returns (bool success)",
            "function balanceOf(address owner) external view returns (uint256 balance)",
            "function decimals() external view returns (uint8 decimalPlaces)",
            "function name() external view returns (string memory tokenName)",
            "function symbol() external view returns (string memory tokenSymbol)",
            "function totalSupply() external view returns (uint256 totalTokensIssued)",
            "function transfer(address to, uint256 value) external returns (bool success)",
            "function transferFrom(address from, address to, uint256 value) external returns (bool success)",
            "function deposit() public payable",
            "function withdraw(uint wad) public"
        ];

        const USDCadd = "0x853d955aCEf822Db058eb8505911ED77F175b99e"
        const USDCABI = fs.readFileSync("./localhost_tests/abis/DAI_ABI.json").toString()


        const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
        const UNISWAP_ROUTER_ABI = fs.readFileSync("./localhost_tests/abis/uniswapAbi.json").toString()

        var triCryptoDepositAdd = "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B" 
var triCryptoDepositAbi =  fs.readFileSync("./localhost_tests/abis/fraxUSDC.json").toString()

        
        

        //   it("give WETH to users", async () => {
        //     const myWETH = new DRE.ethers.Contract(WETHadd,WETHabi)
        //     var signer = await contractGetters.getFirstSigner();
        //     //give signer 1 WETH so he can get LP tokens
        //     var options = {value: DRE.ethers.utils.parseEther("1.0")}
        //     await myWETH.connect(signer).deposit(options);
        //     var signerWeth = await myWETH.connect(signer).balanceOf(signer.address);
        //     expect(
        //       signerWeth.toString()
        //     ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("1.0"), "Did not get WETH");
        //   });

          it("deposit WETH", async () => {
            //emergency deposits 100 WETH to pool to provide liquidity
            const myWETH = new DRE.ethers.Contract(WETHadd,WETHabi)
            const emergency = (await DRE.ethers.getSigners())[1]
            var signer = await contractGetters.getFirstSigner();
            const lendingPool = await contractGetters.getLendingPool();

            const dataProv = await contractGetters.getAaveProtocolDataProvider();

            var options = {value: DRE.ethers.utils.parseEther("100.0")}

            await myWETH.connect(emergency).deposit(options);
            var signerWeth = await myWETH.connect(emergency).balanceOf(emergency.address);

            expect(
              signerWeth.toString()
            ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("100.0"), "Did not get WETH");

            await myWETH.connect(emergency).approve(lendingPool.address,DRE.ethers.utils.parseEther("100.0"))

            await lendingPool.connect(emergency).deposit(myWETH.address, 1, DRE.ethers.utils.parseUnits('100'), await emergency.getAddress(), '0'); 
            const resDat = await dataProv.getReserveData(myWETH.address, 1)
            

            expect(
              resDat.availableLiquidity.toString()
            ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("100.0"), "Did not get WETH");
          });

          it("Uniswap ETH for frax", async () => {
            const USDC = new ethers.Contract(USDCadd,USDCABI)

            const myWETH = new DRE.ethers.Contract(WETHadd,WETHabi)
            const emergency = (await DRE.ethers.getSigners())[1]
            var signer = await contractGetters.getFirstSigner();
            
            const UNISWAP_ROUTER_CONTRACT = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI)

            
            const path = [myWETH.address, USDC.address];
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time


            var options = {value: ethers.utils.parseEther("1000.0")}

            await UNISWAP_ROUTER_CONTRACT.connect(signer).swapExactETHForTokens(ethers.utils.parseEther("1000.0"), path, signer.address, deadline,options)

            var signerDAI = await USDC.connect(signer).balanceOf(signer.address)

            expect(
                signerDAI.toString()
            ).to.not.be.bignumber.equal(0, "Did not get Frax");
          });

          it("get LP tokens", async () => {
            //emergency deposits 100 WETH to pool to provide liquidity
            var signer = await contractGetters.getFirstSigner();
            const DAI = new DRE.ethers.Contract(USDCadd,USDCABI)
            const lendingPool = await contractGetters.getLendingPool();
            
            var triCryptoDeposit = new DRE.ethers.Contract(triCryptoDepositAdd,triCryptoDepositAbi)

            var amounts = [ethers.utils.parseEther("1000"),ethers.utils.parseEther("0")]

            await DAI.connect(signer).approve(triCryptoDeposit.address,ethers.utils.parseEther("100000"))

            // await triCryptoDeposit.connect(signer).calc_token_amount([10**2, 10**2,10**2],true)
            await triCryptoDeposit.connect(signer).add_liquidity(amounts,ethers.utils.parseEther("100"))

            var CurveToken = new DRE.ethers.Contract(CurveTokenAdd,CurveTokenAddabi)
            var mycurve = await CurveToken.connect(signer).balanceOf(signer.address)

            console.log("my curve amount ",mycurve)
            
            expect(
              mycurve.toString()
            ).to.not.be.equal("0", "Did not get curve"); //this can be general, we assume that curve's stuff is correct
          });
        
          it("deposit LP and borrow", async () => {
            //emergency deposits 100 WETH to pool to provide liquidity
            const myWETH = new DRE.ethers.Contract(WETHadd,WETHabi)
            const emergency = (await DRE.ethers.getSigners())[1]
            var signer = await contractGetters.getFirstSigner();
            const lendingPool = await contractGetters.getLendingPool();
            var CurveToken = new DRE.ethers.Contract(CurveTokenAdd,CurveTokenAddabi)

            const dataProv = await contractGetters.getAaveProtocolDataProvider();

            await CurveToken.connect(signer).approve(lendingPool.address,ethers.utils.parseEther("100000.0"))
            await lendingPool.connect(signer).deposit(CurveToken.address, 1, DRE.ethers.utils.parseUnits('900'), await signer.getAddress(), '0'); 
            await lendingPool.connect(signer).setUserUseReserveAsCollateral(CurveToken.address, 1, true); 
            
            var userDat = await lendingPool.connect(signer).getUserAccountData(signer.address,1,false)

            const addProv = await contractGetters.getLendingPoolAddressesProvider();

            const curveOracleAdd = await addProv.connect(signer).getCurvePriceOracleWrapper();
            var curveOracleAbi = [
              "function getAssetPrice(address asset) public view returns (uint256)"
          ]

          const curveOracle = new DRE.ethers.Contract(curveOracleAdd,curveOracleAbi);

            const pricePerToken = await curveOracle.connect(signer).getAssetPrice(CurveToken.address);
            console.log("pricePerToken: ",pricePerToken)
            var col = BigNumber.from(pricePerToken.toString()).mul(900)
            
            expect(
              userDat.totalCollateralETH.toString()
            ).to.be.bignumber.equal(col.toString(), "Did not deposit 3crv");
            
            await lendingPool.connect(signer).borrow(myWETH.address, 1, DRE.ethers.utils.parseEther("0.01"), 1, '0', signer.address); 
            
            userDat = await lendingPool.connect(signer).getUserAccountData(signer.address,1,false)

            expect(
              userDat.totalDebtETH.toString()
            ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("0.01"), "Did not get debt token");


            var signerWeth = await myWETH.connect(signer).balanceOf(signer.address);

            expect(
              signerWeth.toString()
            ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("0.01"), "Did not get WETH");

            await expect(
                lendingPool.connect(signer).borrow(myWETH.address, 1, DRE.ethers.utils.parseEther("1000"), 1, '0', signer.address)
              ).to.be.revertedWith(VL_COLLATERAL_CANNOT_COVER_NEW_BORROW);
          });
    }
)
