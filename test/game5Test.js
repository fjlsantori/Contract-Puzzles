const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {/* 
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    //bytes20(threshold) is capturing top left 20 bytes
    //we need to create a bytes20(address) minor to bytes20(threshold)
    const [deployer] = await ethers.getSigners();

    // Imprimir por pantalla en los tests
    console.log("Address of deployer:", deployer.address);

    await game.win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  }); */
  let game;
  let deployer;
  const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

  async function deployContractAndSetVariables(){
    const Game5 = await ethers.getContractFactory('Game5');
    const game = await Game5.deploy();

    // Crear una dirección específica para el deployer que sea menor que el umbral
    const customDeployerWallet = await ethers.Wallet.createRandom();
    assert(customDeployerWallet.address < threshold, "Custom deployer address is not below threshold");

    return{ game, deployer: customDeployerWallet };
  }

  beforeEach(async function(){
    ({game, deployer: customDeployer} = await loadFixture(deployContractAndSetVariables));
  });

  it('should be a winner', async function () {
    //------- con el beforeEach ya no hace falta la siguiente línea
    //const { game } = await loadFixture(deployContractAndSetVariables);

    // Imprimir por pantalla en los tests
    console.log("Address of custom deployer:", customDeployer.address);

    // good luck
    //bytes20(threshold) is capturing top left 20 bytes
    //we need to create a bytes20(address) minor to bytes20(threshold)
    /* const [deployer] = await ethers.getSigners(); */
  
    await game.connect(customDeployer).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
    /* assert(await game.isWon()).to.equal(true); */

      // Comprobar que isWon se ha establecido en true
      //assert(await game.isWon()).to.equal(true);
  });
});


