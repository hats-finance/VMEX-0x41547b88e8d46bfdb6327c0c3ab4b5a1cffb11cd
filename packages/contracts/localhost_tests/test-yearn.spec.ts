import { makeSuite } from "../test-suites/test-aave/helpers/make-suite";
const chai = require("chai");
const { expect } = chai;
import { DRE } from "../helpers/misc-utils";
import { BigNumber, utils } from "ethers";

makeSuite(
    "Yearn ",
    () => {
        it("Deposit to yearn to get yv tokens", async () => {
            const myWETH = new DRE.ethers.Contract(WETHadd,WETHabi)
            var signer = await contractGetters.getFirstSigner();
            //give signer 1 WETH so he can get LP tokens
            var options = {value: DRE.ethers.utils.parseEther("100.0")}
            await myWETH.connect(signer).deposit(options);
            var signerWeth = await myWETH.connect(signer).balanceOf(signer.address);
            expect(
              signerWeth.toString()
            ).to.be.bignumber.equal(DRE.ethers.utils.parseEther("100.0"), "Did not get WETH");
        });


    }
);