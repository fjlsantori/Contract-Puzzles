const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Game5', function () {
  let game;
  const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

  function findAddressBelowThreshold(){
    let candidate;
    let tempDeployerWallet;
    do {
        tempDeployerWallet = ethers.Wallet.createRandom();
        candidate = tempDeployerWallet.address;
    } while (!(ethers.BigNumber.from(candidate) < ethers.BigNumber.from(threshold)));

    return tempDeployerWallet;  // Devolver el objeto Wallet completo
}

  beforeEach(async function () {
    const Game5 = await ethers.getContractFactory('Game5');
    game = await Game5.deploy();
  });

  it('should set isWon to true with a valid address', async function () {
    const validAddressWallet = findAddressBelowThreshold();
    console.log("Valid Address ",validAddressWallet.address);

    await game.connect(validAddressWallet).win();

    expect(await game.isWon()).to.equal(true);
  });

  it('should revert with an invalid address', async function () {
    const invalidAddress = "0x0123456789012345678901234567890123456789";

    await expect(game.win({ from: invalidAddress })).to.be.revertedWith("Nope. Try again!");

    expect(await game.isWon()).to.equal(false);
  });

  it('should revert with an address equal to threshold', async function () {
    await expect(game.win({ from: threshold })).to.be.revertedWith("Nope. Try again!");

    expect(await game.isWon()).to.equal(false);
  });
});

