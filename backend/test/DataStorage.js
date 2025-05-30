const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("testing DataStorage", function () {
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
    const CUSTOMER1LOCATION = "Lyon";
    const CUSTOMER2NAME = "Customer 2";
    const CUSTOMER2EMAIL = "customer2@gmail.com";
    const CUSTOMER2LOCATION = "Nice";
    
  
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
      await dataStorage.setGoldChainAddress(admin.address);
    });
  

    //test de déploiment
    describe("Deploy", function () {
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

    //test de l'ajout d'un jeweler
    describe("Add Jeweler", function () {
      it("should add a jeweler", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        expect(await dataStorage.getJewelerCount()).to.equal(1);        
      });

      it("should add a two jewelers", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        await dataStorage.connect(admin).addJeweler(jeweler2.address, JEWELER2NAME, JEWELER2EMAIL, JEWELER2LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        expect(await dataStorage.getJewelerCount()).to.equal(2);        
      });

      it("should add a jeweler with correct name", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        let jew = await dataStorage.getOneJeweler(jeweler1.address);
        expect(jew.name.toString()).to.equal(JEWELER1NAME);        
      });

      it("should add a jeweler with correct email", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        let jew = await dataStorage.getOneJeweler(jeweler1.address);
        expect(jew.email.toString()).to.equal(JEWELER1EMAIL);        
      });

      it("should add a jeweler with correct location", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        let jew = await dataStorage.getOneJeweler(jeweler1.address);
        expect(jew.location.toString()).to.equal(JEWELER1LOCATION);        
      });

      it("should add a jeweler with not available", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        let jew = await dataStorage.getOneJeweler(jeweler1.address);
        expect(jew.available).to.equal(NOT_AVAILABLE);        
      });

      it("should add a jeweler with not visible", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        let jew = await dataStorage.getOneJeweler(jeweler1.address);
        expect(jew.visible).to.equal(NOT_VISIBLE);        
      });
     

    });

    //test de l'ajout d'un customer
    describe("Add Customer", function () {
      it("should add a customer", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        expect(await dataStorage.getCustomerCount()).to.equal(1);        
      });

      it("should add a two customers", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        await dataStorage.connect(admin).addCustomer(customer2.address, CUSTOMER2NAME, CUSTOMER2EMAIL, CUSTOMER2LOCATION, NOT_VISIBLE);
        expect(await dataStorage.getCustomerCount()).to.equal(2);        
      });

      it("should add a customer with correct name", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        let cus = await dataStorage.getOneCustomer(customer1.address);
        // console.log("name = " + cus.name.toString());
        // console.log("email = " + cus.email.toString());
        expect(cus.name.toString()).to.equal(CUSTOMER1NAME);        
      });

      it("should add a customer with correct email", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        let cus = await dataStorage.getOneCustomer(customer1.address);
        expect(cus.email.toString()).to.equal(CUSTOMER1EMAIL);        
      }); 

      it("should add a customer with correct location", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        let cus = await dataStorage.getOneCustomer(customer1.address);
        expect(cus.location.toString()).to.equal(CUSTOMER1LOCATION);        
      });

    });

    //test de creation d'un certificat
    describe("Create Certificate", function () {
      it("should create a certificate", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
      });
    });

    describe("Security", function () {
      it("should not be possible to set the goldChainAddress if not owner", async function () {
        await expect(dataStorage.connect(customer1).setGoldChainAddress(customer1.address))
          .to.be.revertedWithCustomError(dataStorage, "OwnableUnauthorizedAccount");
      });

      it("should not be possible to add a jeweler if not owner", async function () {  
        await expect(dataStorage.connect(jeweler1).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE)).to.be.revertedWith("Only GoldChain can call this function");
      });

      it("should not be possible to add a customer if not owner", async function () {
        await expect(dataStorage.connect(customer1).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE)).to.be.revertedWith("Only GoldChain can call this function");
      });

      it("should not be possible to update a customer if not owner", async function () {
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        await expect(dataStorage.connect(customer1).updateCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE)).to.be.revertedWith("Only GoldChain can call this function");
      });

      it("should not be possible to update a jeweler if not owner", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        await expect(dataStorage.connect(jeweler1).updateJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_VISIBLE)).to.be.revertedWith("Only GoldChain can call this function");
      });

      it("should not be possible to add a certificate if not owner", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        await expect(dataStorage.connect(jeweler1).addCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0)).to.be.revertedWith("Only GoldChain can call this function");
      });
      
      it("should not be possible to update a certificate if not owner", async function () {
        await dataStorage.connect(admin).addJeweler(jeweler1.address, JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_AVAILABLE, NOT_VISIBLE);
        await dataStorage.connect(admin).addCustomer(customer1.address, CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
        await expect(dataStorage.connect(jeweler1).updateCertificateStatus(0, 0)).to.be.revertedWith("Only GoldChain can call this function");
      });

      
    });


  });
  