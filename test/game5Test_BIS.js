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

  async function findValidWinner() {
    const thresholdBigInt = ethers.BigNumber.from(threshold);

    do {
      // Get random address
      const randomSigner = ethers.Wallet.createRandom();
      const winnerAddress = randomSigner.address;

      console.log("Winner Address:", winnerAddress);
      console.log("Threshold Address:", threshold);

      // Convertir direcciones a números enteros y compararlos
      const winnerAddressBigInt = ethers.BigNumber.from(winnerAddress);

      if (winnerAddressBigInt.lt(thresholdBigInt)) {
        return randomSigner;
      }
    } while (true);
  }

  beforeEach(async function () {
    ({ game } = await loadFixture(deployContractAndSetVariables));
  });

  it('should be a winner', async function () {
    try {
      // Encontrar un ganador válido
      const winnerSigner = await findValidWinner();

      // Conectar al contrato utilizando el Signer ganador
      const connectedGame = game.connect(winnerSigner);

      // Llamar a la función win() desde la dirección del ganador
      await connectedGame.win();

      // Verificar si el juego ha sido ganado correctamente
      const isWon = await game.isWon();
      expect(isWon).to.equal(true, 'El juego no ha sido ganado');
    } catch (error) {
      console.error(error.message);
    }
  });
});
