import {
  APPROVAL_AMOUNT_LENDING_POOL,
  MAX_UINT_AMOUNT,
  ZERO_ADDRESS,
  PERCENTAGE_FACTOR
} from "../../helpers/constants";
import { convertToCurrencyDecimals } from "../../helpers/contracts-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import { RateMode, ProtocolErrors } from "../../helpers/types";
import { makeSuite, TestEnv } from "./helpers/make-suite";
import { CommonsConfig } from "../../markets/aave/commons";
import { strategyUSDC, strategyWETH } from "../../markets/aave/reservesConfigs";
import { repay } from "./helpers/actions";
import BigNumber from 'bignumber.js';
const AAVE_REFERRAL = CommonsConfig.ProtocolGlobalParams.AaveReferral;

makeSuite("Yearn vault tokens", (testEnv: TestEnv) => {
  const {
    INVALID_FROM_BALANCE_AFTER_TRANSFER,
    INVALID_TO_BALANCE_AFTER_TRANSFER,
    VL_TRANSFER_NOT_ALLOWED,
    VL_COLLATERAL_CANNOT_COVER_NEW_BORROW
  } = ProtocolErrors;

  let originalInputAmount;

  it("User 1 deposits 1000 yvTricrypto2 in tranche 1 at different pricePerTokens", async () => {
    const { users, pool, yvTricrypto2, ayvTricrypto2, oracle } = testEnv;

    await yvTricrypto2
      .connect(users[1].signer)
      .mint(ethers.utils.parseEther("1000000"));

    await yvTricrypto2
      .connect(users[1].signer)
      .approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);

    let cumulative = new BigNumber("0");
    let cumulativeWeighted = new BigNumber("0");
    //user 1 deposits 1000 DAI
    for(let i = 1;i<=10;i++){
      await yvTricrypto2
        .connect(users[1].signer).setPricePerShare(await convertToCurrencyDecimals(
          yvTricrypto2.address,
          (i).toString()
        ))
      const amountDeposit = ethers.utils.parseEther(
        (i).toString()
      );
      const currentPricePerShare = (await yvTricrypto2
        .connect(users[1].signer)
        .pricePerShare())
      cumulative = cumulative.plus(new BigNumber(amountDeposit.toString()));
      cumulativeWeighted = cumulativeWeighted.plus(new BigNumber(amountDeposit.toString()).multipliedBy(currentPricePerShare.toString()));

      await pool
        .connect(users[1].signer)
        .deposit(yvTricrypto2.address, 1, amountDeposit, users[1].address, "0");
      
      const balance = new BigNumber((await ayvTricrypto2.balanceOf(users[1].address)).toString());//();

      const currAvgPricePerShare = new BigNumber((await ayvTricrypto2
      .connect(users[1].signer)
      .getAverageEntryPrice(users[1].address)).toString());


      const average = cumulativeWeighted.div(new BigNumber((cumulative).toString()))

      expect(balance.toFixed()).to.be.equal(
        cumulative.toFixed(),
        "invalid balance"
      );
      console.log("pass 1: ")
      expect(Number(currAvgPricePerShare.minus(average).absoluteValue())).to.be.lessThan(
        10,
        "invalid average entry price"
      );
      
      }

      const currPricePerShare = await oracle
      .connect(users[1].signer).getAssetPrice(yvTricrypto2.address);
      const userAmountTotal = await ayvTricrypto2.balanceOf(users[1].address);

      originalInputAmount = userAmountTotal.mul(currPricePerShare);
      console.log("originalInputAmount: ",originalInputAmount);
  });
    it("User 1 withdraws 1000 yvTricrypto2 in tranche 1 at different pricePerTokens", async () => {
      const { users, pool, yvTricrypto2, ayvTricrypto2, addressesProvider, oracle, assetMappings, helpersContract } = testEnv;
  
      let cumulative = new BigNumber("0");
      const origPricePerShare = await yvTricrypto2
        .connect(users[1].signer)
        .pricePerShare()
      const trancheTreasury = await addressesProvider.getPoolAdmin("1");
      const VMEXReserveFactor = await assetMappings.getVMEXReserveFactor(yvTricrypto2.address);
      const trancheReserveFactor = await (await helpersContract.getReserveConfigurationData(yvTricrypto2.address, "1")).reserveFactor;
      let userAmountTotal = new BigNumber("0");
      let trancheAdminAmountTotal = new BigNumber("0");
      let VMEXAmountTotal = new BigNumber("0");
      //user 1 deposits 1000 DAI
      for(let i = 1;i<=10;i++){
        console.log("i: ", i);
        await yvTricrypto2
        .connect(users[1].signer).setPricePerShare(await convertToCurrencyDecimals(
          yvTricrypto2.address,
          (i+10).toString()
        ))
        const amountDeposit = await convertToCurrencyDecimals(
          yvTricrypto2.address,
          (i).toString()
        );
  
        cumulative = cumulative.plus(new BigNumber(amountDeposit.toString()));
  
        await pool
          .connect(users[1].signer)
          .withdraw(yvTricrypto2.address, 1, amountDeposit, users[1].address);

        console.log("After withdraw")

        const balance = await ayvTricrypto2.balanceOf(users[1].address);
        userAmountTotal = userAmountTotal.plus(new BigNumber(balance.toString()));
        const trancheAdminAmount = await ayvTricrypto2.balanceOf(trancheTreasury);
        const VMEXAdminAmount = await ayvTricrypto2.balanceOf("0xF2539a767D6a618A86E0E45D6d7DB3dE6282dE49");

        // const expectedTrancheAdminAmount = new BigNumber(amountDeposit.toString()).percentMul(new BigNumber(trancheReserveFactor.toString()));
        trancheAdminAmountTotal = trancheAdminAmountTotal.plus(new BigNumber(trancheAdminAmount.toString()));
        VMEXAmountTotal = VMEXAmountTotal.plus(new BigNumber(VMEXAdminAmount.toString()));
        
        expect((await yvTricrypto2
          .connect(users[1].signer)
          .pricePerShare()).toString()).to.be.equal(
          origPricePerShare,
          "invalid average entry price"
        );
        expect(trancheAdminAmount.toNumber()).to.be.gte(0);
        expect(VMEXAdminAmount.toNumber()).to.be.gte(0);
      }

      const currPricePerShare = await oracle
      .connect(users[1].signer).getAssetPrice(yvTricrypto2.address);
      const finalUserAmount = userAmountTotal.multipliedBy(new BigNumber(currPricePerShare.toString()))
      const finalTrancheAmount = userAmountTotal.multipliedBy(new BigNumber(currPricePerShare.toString()))
      const finalVMEXAmount = userAmountTotal.multipliedBy(new BigNumber(currPricePerShare.toString()))
      console.log("finalUserAmount: ",finalUserAmount);
      console.log("finalTrancheAmount: ",finalTrancheAmount);
      console.log("finalVMEXAmount: ",finalVMEXAmount);

      const totalAmount = finalUserAmount.plus(finalTrancheAmount).plus(finalVMEXAmount);
      const interestEarned = totalAmount.minus(originalInputAmount);
      const expectedTrancheAmount = interestEarned.multipliedBy(new BigNumber(trancheReserveFactor.toString()));
      const expectedVMEXAmount = interestEarned.minus(expectedTrancheAmount).multipliedBy(new BigNumber(VMEXReserveFactor.toString()));
      const expectedUserAmount = interestEarned.minus(expectedTrancheAmount).minus(expectedVMEXAmount);
      expect(finalUserAmount).to.be.gte(originalInputAmount)
      expect(finalTrancheAmount).to.be.eq(expectedTrancheAmount)
      expect(finalVMEXAmount).to.be.eq(expectedVMEXAmount)
      expect(finalUserAmount).to.be.eq(expectedUserAmount)
  });

});
