const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    // const signer = ethers.provider.getSigner(0);
    const signer = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

/*     ethers.getSigner returns a promise, while ethers.provider.getSigner don't. 
    That is, you need to use await in the first case. */
    // const [signer, signer1, signer2] = await ethers.getSigner();

/*     The Signer returned by ethers.getSigner is a wrapper created by the plugin 
    that behaves pretty much exactly like the one returned 
    by ethers.provider.getSigner, except that it has a .address property, 
    so you don't need to call signer.getAddress(), 
    which is an async function. */

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    // const address = await signer.getAddress();

    return { game, signer, signer2, signer3 };
  }

  it('should be a winner', async function () {
    const { game, signer, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(signer).buy({ value: '2' });
    await game.connect(signer2).buy({ value: '3' });
    await game.connect(signer3).buy({ value: '1' });

    address1 = signer.getAddress();
    address2 = signer2.getAddress();
    address3 = signer3.getAddress();

    // TODO: win expects three arguments
    await game.win(address1, address2, address3);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
