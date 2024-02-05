const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert, expect } = require('chai');
const { ethers } = require('hardhat');


describe('Game5', function () {

  let game;
  const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

  async function deployContractAndSetVariables() {
    const Game5 = await ethers.getContractFactory('Game5');
    const game = await Game5.deploy();

    return { game };
  }

  beforeEach(async function () {
    ({ game } = await loadFixture(deployContractAndSetVariables));
  });

  it('should be a winner', async function () {
    //------- with beforeEach we dont need the next line
    //const { game } = await loadFixture(deployContractAndSetVariables);

    try {
      let winnerAddress;

      /* I use a do-while loop to ensure that a random address
      is generated and check to see if it meets the condition on each iteration.
      This is done within the "it" test, so it looks for an address that meets
      the condition specifically for this test. */

      do {
        // Get random address
        const randomSigner = ethers.Wallet.createRandom();
        winnerAddress = randomSigner.address;
      } while (winnerAddress.toLowerCase() >= threshold.toLowerCase());

      //console.log("Deployer Address:", deployer.address);
      console.log("Winner Address:", winnerAddress);
      console.log("Threshold Address:", threshold);

      // Compare addresses in hexadecimal
      expect(winnerAddress.toLowerCase()).to.be.lt(threshold.toLowerCase());

      // Conect the winner with the contract and call Win function
      await game.connect(deployer).win();

      // Verify the isWon variable is true after callin Win function
      expect(await game.isWon()).to.equal(true, 'You did not win the game');
    } catch (error) {
      console.error(error.message);
    }
  });
});


