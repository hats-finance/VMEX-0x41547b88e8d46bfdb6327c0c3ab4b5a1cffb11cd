const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
    approveUnderlying,
    getLendingPoolImpl,
    lendingPoolPause,
    getUserSingleReserveData
} = require("../dist/src.ts/utils.js");
const { 
    borrow,
    marketReserveAsCollateral,
    withdraw,
    repay,
    swapBorrowRateMode,
    supply
} = require("../dist/src.ts/protocol.js");


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


describe("Supply - end-to-end test", () => {
    let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const owner = provider.getSigner();
    
    it("1 - signer should receive 1 WETH so he can transact for LP tokens", async () => {
        const WETH = new ethers.Contract(WETHadd, WETHabi, owner);
        await WETH.connect(owner).deposit({ value: ethers.utils.parseEther("2.0")});
        expect(await WETH.balanceOf(await owner.getAddress())).to.be.above(ethers.utils.parseEther("1.0"))
    });

    it("2 - should test the getLendingPooImpl util", async () => {
        expect(await getLendingPoolImpl(owner, 'localhost')).to.be.an.instanceOf(ethers.Contract);
    })

    it("3 - should test the approveUnderlying util", async () => {
        let lendingPool = await getLendingPoolImpl(owner, "localhost");
        await approveUnderlying(owner, ethers.utils.parseEther("1.0"), WETHadd, lendingPool.address);
    })

    
    
    it("4 - should test lendingPoolSetPause() function", async () => {
        expect(await lendingPoolPause(owner, false, 'localhost', 0)).to.be.false;
        
    })
    
    it("5 - should test whether the lending Pool is paused or not", async () => {
        let lendingPool = await getLendingPoolImpl(owner, 'localhost');
        expect(await lendingPool.paused(0)).to.be.false;    
    })

    it("6 - should test the protocol supply function", async () => {
        expect(await supply({
            underlying: WETHadd,
            trancheId: 0,
            amount: '2.0',
            signer: owner,
            network: 'localhost',
            test: true
        }, () => { return true})).to.be.true;

    })

    it("7 - should test that the user has a non-zero amount of aTokens for an asset", async () => {
        let data = await getUserSingleReserveData(owner, 'localhost', WETHadd, 0);
        let aToken = new ethers.Contract(data.aTokenAddress, WETHabi, owner);
        expect(await aToken.balanceOf(await owner.getAddress())).to.be.above(ethers.utils.parseEther('1.0'))
    })

})

describe("Borrow - end-to-end test", () => {
    let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const owner = provider.getSigner();

    it('1 - should check the number of aTokens of a secondary asset are available to borrow')
})