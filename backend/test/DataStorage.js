const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("testing GoldChain", function () {
    let admin, jeweler1, jeweler2, customer1, customer2;
    let dataStorage, GoldChain;
  
    before(async function () {
      // We can get our addresses only once, and reuse them for each test
      [admin, jeweler1, jeweler2, customer1, customer2] = await ethers.getSigners();
    });
  
    beforeEach(async function () {
      // Must reset DatatStorage instance before each test
  
      // DataStorage deployment
      let DataStorage = await hre.ethers.getContractFactory(
        "DataStorage"
        );
      dataStorage = await DataStorage.deploy();
    });
  
    it("should set the right owner", async function () {
        expect(await dataStorage.owner()).to.equal(admin.address);
    });
  
    it("should be deployed without any certificate", async function () {
        expect(await dataStorage.getCertificateCount()).to.equal(0);
    });
  
    it("should be deployed without any jeweler", async function () {
        expect(await dataStorage.getJewelerCount()).to.equal(0);
    });
  
    it("should be deployed without any customer", async function () {
        expect(await dataStorage.getCustomerCount()).to.equal(0);
    });
  });
  