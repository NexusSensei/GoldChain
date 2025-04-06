const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy First dataStorage.sol
    const dataStorage = await ethers.deployContract("DataStorage");
    await dataStorage.waitForDeployment();
    console.log( "DatatStorage: " + `deployed to ${dataStorage.target}` );
    
    // Deploy Second goldChain.sol
    const GoldChain = await ethers.getContractFactory('GoldChain');
    const goldChain = await GoldChain.deploy(dataStorage.target);

    console.log( "GoldChain: " + `deployed to ${goldChain.target}` );

    // Set GoldChain address in DataStorage
    await dataStorage.setGoldChainAddress(goldChain.target);
    console.log( "DataStorage GoldChainAddress: " + `updated to ${goldChain.target}` );

}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})