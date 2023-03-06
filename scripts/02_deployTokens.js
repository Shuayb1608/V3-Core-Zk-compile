async function main() {
    const [owner, signer2] = await ethers.getSigners();
  
    Tether = await ethers.getContractFactory('Tether', owner);
    tether = await Tether.deploy();
  
    Usdc = await ethers.getContractFactory('UsdCoin', owner);
    usdc = await Usdc.deploy();
  
    WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', owner);
    wrappedBitcoin = await WrappedBitcoin.deploy();

    // console.log(owner, "owner");
    // console.log(signer2, "signer2");
  

    // console.log(owner.address, "ownerAddress");
    // console.log(signer2.address, "signer2Adress");
  
    await tether.connect(owner).mint(
      '0xb9B2c57e5428e31FFa21B302aEd689f4CA2447fE',
      ethers.utils.parseEther('100000')
    )
    await usdc.connect(owner).mint(
      '0xb9B2c57e5428e31FFa21B302aEd689f4CA2447fE',
      ethers.utils.parseEther('100000')
    )
    await wrappedBitcoin.connect(owner).mint(
      '0xb9B2c57e5428e31FFa21B302aEd689f4CA2447fE',
      ethers.utils.parseEther('100000')
    )
  
    console.log('let TETHER_ADDRESS=', `'${tether.address}'`)
    console.log('let USDC_ADDRESS=', `'${usdc.address}'`)
    console.log('let WRAPPED_BITCOIN_ADDRESS=', `'${wrappedBitcoin.address}'`)
  }
  
  /*
  npx hardhat run --network localhost scripts/02_deployTokens.js
  */
  
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });