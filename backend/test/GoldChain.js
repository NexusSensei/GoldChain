const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("testing GoldChain", function () {
  let admin, jeweler1, jeweler2, customer1, customer2;
  let dataStorage, GoldChain;
  const JEWELER1NAME = "Jeweler 1";
  const JEWELER1EMAIL = "jeweler1@gmail.com";
  const JEWELER1LOCATION = "Paris";
  const NOT_AVAILABLE = false;
  const NOT_VISIBLE = false;
  const AVAILABLE = true;
  const VISIBLE = true;
  const JEWELER2NAME = "Jeweler 2";
  const JEWELER2EMAIL = "jeweler2@gmail.com";
  const JEWELER2LOCATION = "Marseille";
  const CUSTOMER1NAME = "Customer 1";
  const CUSTOMER1EMAIL = "customer1@gmail.com";
  const CUSTOMER2NAME = "Customer 2";
  const CUSTOMER2EMAIL = "customer2@gmail.com";

  async function deployGoldChainFixture() {
    const [admin, jeweler1, jeweler2, customer1, customer2, otherPerson] = await ethers.getSigners();
    const DataStorage = await ethers.getContractFactory("DataStorage");
    const dataStorage = await DataStorage.deploy();
    const GoldChain = await ethers.getContractFactory("GoldChain");
    const goldChain = await GoldChain.deploy(dataStorage.target);
    
    return { goldChain, admin, jeweler1, jeweler2, customer1, customer2, otherPerson, dataStorage };
}


  //test de déploiment
  describe("Deploy", function () {
    it("Should deploy GoldChain", async function () {
        const { goldChain, admin } = await loadFixture(deployGoldChainFixture);
        expect(await goldChain.admin()).to.equal(admin.address);
    });

    it("should be deployed without any jeyeler", async function () {
      const { goldChain, admin } = await loadFixture(deployGoldChainFixture);
      expect(await goldChain.getJewelerCount()).to.equal(0);
    });

    it("should be deployed without any customer", async function () {
      const { goldChain, admin } = await loadFixture(deployGoldChainFixture);
        expect(await goldChain.getCustomerCount()).to.equal(0);
    });

  });

  describe("add jeweler", function () {
    it("should add a jeweler", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      expect(await goldChain.getJewelerCount()).to.equal(1);
    });

    it("should add a jeweler with correct name", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.name).to.equal(JEWELER1NAME);
    });

    it("should add a jeweler with correct email", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.email).to.equal(JEWELER1EMAIL);
    });

    it("should add a jeweler with correct location", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.location).to.equal(JEWELER1LOCATION);
    });

    it("should add a jeweler with correct visible status", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.visible).to.equal(VISIBLE);
    });

    it("should a new jeweler is NOT_AVAIBLE", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.available).to.equal(NOT_AVAILABLE);
    });

    it("should emit jewelerCreated event", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);      
      await expect(goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION))
      .to.emit(goldChain,
        "jewelerCreated"
        ).withArgs(jeweler1.address, anyValue); 
    });
    
  });

  describe("update jeweler name", function () {
    it("should add a jeweler", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler1).updateJeweler(JEWELER2NAME, JEWELER1EMAIL, JEWELER1LOCATION, VISIBLE);
      expect(jew.name).to.equal(JEWELER2NAME);
    });

    it("should add a jeweler with correct email", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.email).to.equal(JEWELER1EMAIL);
    });

    it("should add a jeweler with correct location", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.location).to.equal(JEWELER1LOCATION);
    });

    it("should add a jeweler with correct visible status", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.visible).to.equal(VISIBLE);
    });

    it("should a new jeweler is NOT_AVAIBLE", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.available).to.equal(NOT_AVAILABLE);
    });
    
  });


  describe("add customer", function () {
    it("should add a customer", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL);
      expect(await goldChain.getCustomerCount()).to.equal(1);
    });

    it("should add a customer with correct name", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.name).to.equal(CUSTOMER1NAME);
    });

    it("should add a customer with correct email", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.email).to.equal(CUSTOMER1EMAIL);
    });

    it("should add a customer with correct visible status", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.visible).to.equal(VISIBLE);
    });

  });

});
