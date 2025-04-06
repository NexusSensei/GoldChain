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
  const CUSTOMER1LOCATION = "Lyon";
  const CUSTOMER2NAME = "Customer 2";
  const CUSTOMER2EMAIL = "customer2@gmail.com";
  const CUSTOMER2LOCATION = "Nice";

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

    it("should not add a jeweler if already exists", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await expect(goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION)).to.be.revertedWithCustomError(
        goldChain,
        "JewelerIsAlreadyRegistered"
      );
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

    it("should mint a NFT", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      expect(await goldChain.balanceOf(jeweler1.address)).to.equal(1);
    });

    it("should not mint a NFT if not registered", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await expect(goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0)).to.be.revertedWithCustomError(
        goldChain,"NotRegistered");
    });

    it("should mint a NFT with correct ID", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      expect(await goldChain.connect(jeweler1).balanceOf(jeweler1.address)).to.equal(1);
    });   

    it("should mint a NFT with correct owner", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      expect(await goldChain.connect(jeweler1).ownerOf(0)).to.equal(jeweler1.address);
    }); 
    
    it("should return the correct tokenURI", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      const TokenURIdata = "data:application/json;base64,eyJuYW1lIjogIkdvbGRDaGFpbiBDZXJ0aWZpY2F0ZSBORlQgIzAiLCAiYXR0cmlidXRlcyI6IFt7InRyYWl0X3R5cGUiOiAiSmV3ZWxlck5hbWUiLCJ2YWx1ZSI6ICJCaWpvdXRlcmllIEpvbGllIn0seyJ0cmFpdF90eXBlIjogIm1haW5NYXRlcmlhbCIsInZhbHVlIjogIjAifSx7InRyYWl0X3R5cGUiOiAibWFpbkdlbVN0b25lcyIsInZhbHVlIjogIjEifSx7InRyYWl0X3R5cGUiOiAid2VpZ2h0SW5HcmFtcyIsInZhbHVlIjogIjkifSx7InRyYWl0X3R5cGUiOiAiZGVzY3JpcHRpb24iLCJ2YWx1ZSI6ICJCYWd1ZSBlbiBvciBhdmVjIHVuIGRpYW1hbnQifSx7InRyYWl0X3R5cGUiOiAiQ2VydGlmaWNhdGVMZXZlbCIsInZhbHVlIjogIjAifV0sImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU9EQXdJaUJvWldsbmFIUTlJamd3TUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRGd3TUNBNE1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqZ3dNQ0lnYUdWcFoyaDBQU0k0TURBaUlHWnBiR3c5SWlObU9HWTVabUVpSUhOMGNtOXJaVDBpSTJRMFlXWXpOeUlnYzNSeWIydGxMWGRwWkhSb1BTSXhNQ0lnY25nOUlqSXdJaUJ5ZVQwaU1qQWlMejQ4ZEdWNGRDQjRQU0kxTUNVaUlIazlJakV5TUNJZ1ptOXVkQzF6YVhwbFBTSTFNQ0lnWm05dWRDMW1ZVzFwYkhrOUlrRnlhV0ZzTENCellXNXpMWE5sY21sbUlpQm1iMjUwTFhkbGFXZG9kRDBpWW05c1pDSWdabWxzYkQwaUl6TXpNeUlnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK1EyVnlkR2xtYVdOaGRDQk9SbFE4TDNSbGVIUStQSFJsZUhRZ2VEMGlOVEFsSWlCNVBTSXhPREFpSUdadmJuUXRjMmw2WlQwaU5EQWlJR1p2Ym5RdFptRnRhV3g1UFNKQmNtbGhiQ3dnYzJGdWN5MXpaWEpwWmlJZ1ptOXVkQzEzWldsbmFIUTlJbUp2YkdRaUlHWnBiR3c5SWlNek16TWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpUGtKaFozVmxJR1Z1SUc5eUlHRjJaV01nZFc0Z1pHbGhiV0Z1ZER3dmRHVjRkRDQ4Wld4c2FYQnpaU0JqZUQwaU5EQXdJaUJqZVQwaU5ESXdJaUJ5ZUQwaU1UZ3dJaUJ5ZVQwaU1UQXdJaUJtYVd4c1BTSnViMjVsSWlCemRISnZhMlU5SWlOa05HRm1NemNpSUhOMGNtOXJaUzEzYVdSMGFEMGlNakFpTHo0OFpXeHNhWEJ6WlNCamVEMGlOREF3SWlCamVUMGlOREl3SWlCeWVEMGlNVFF3SWlCeWVUMGlPREFpSUdacGJHdzlJbTV2Ym1VaUlITjBjbTlyWlQwaUkyWTRaamxtWVNJZ2MzUnliMnRsTFhkcFpIUm9QU0l5TUNJdlBqeHdiMng1WjI5dUlIQnZhVzUwY3owaU5EQXdMREkxTUNBME56QXNNekF3SURRM01Dd3pPREFnTkRBd0xEUXpNQ0F6TXpBc016Z3dJRE16TUN3ek1EQWlJR1pwYkd3OUluZG9hWFJsSWlCemRISnZhMlU5SWlNNFlUWm1NekFpSUhOMGNtOXJaUzEzYVdSMGFEMGlOU0l2UGp4c2FXNWxJSGd4UFNJME1EQWlJSGt4UFNJeU5UQWlJSGd5UFNJME1EQWlJSGt5UFNJME16QWlJSE4wY205clpUMGlJemhoTm1Zek1DSWdjM1J5YjJ0bExYZHBaSFJvUFNJeklpOCtQR3hwYm1VZ2VERTlJak16TUNJZ2VURTlJak13TUNJZ2VESTlJalEzTUNJZ2VUSTlJak00TUNJZ2MzUnliMnRsUFNJak9HRTJaak13SWlCemRISnZhMlV0ZDJsa2RHZzlJak1pTHo0OGJHbHVaU0I0TVQwaU5EY3dJaUI1TVQwaU16QXdJaUI0TWowaU16TXdJaUI1TWowaU16Z3dJaUJ6ZEhKdmEyVTlJaU00WVRabU16QWlJSE4wY205clpTMTNhV1IwYUQwaU15SXZQangwWlhoMElIZzlJalV3SlNJZ2VUMGlOakF3SWlCbWIyNTBMWE5wZW1VOUlqUXdJaUJtYjI1MExXWmhiV2xzZVQwaVFYSnBZV3dzSUhOaGJuTXRjMlZ5YVdZaUlHWnZiblF0ZDJWcFoyaDBQU0ppYjJ4a0lpQm1hV3hzUFNJalpEUmhaak0zSWlCMFpYaDBMV0Z1WTJodmNqMGliV2xrWkd4bElqNUNhV3B2ZFhSbGNtbGxJRXB2YkdsbFBDOTBaWGgwUGp4eVpXTjBJSGc5SWpJd01DSWdlVDBpTmpVd0lpQjNhV1IwYUQwaU5EQXdJaUJvWldsbmFIUTlJamd3SWlCbWFXeHNQU0ozYUdsMFpTSWdjM1J5YjJ0bFBTSWpNek16SWlCemRISnZhMlV0ZDJsa2RHZzlJak1pSUhKNFBTSXhNQ0lnY25rOUlqRXdJaTgrUEhSbGVIUWdlRDBpTlRBbElpQjVQU0kzTURBaUlHWnZiblF0YzJsNlpUMGlNekFpSUdadmJuUXRabUZ0YVd4NVBTSkJjbWxoYkN3Z2MyRnVjeTF6WlhKcFppSWdabWxzYkQwaUl6TXpNeUlnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK01Ed3ZkR1Y0ZEQ0OEwzTjJaejQ9In0="
      await goldChain.connect(jeweler1).createJeweler("Bijouterie Jolie", JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 1, 9, "Bague en or avec un diamant", 0, "Bijouterie Jolie", 0);
      let JSON = await goldChain.connect(jeweler1).tokenURI(0)
      expect(JSON).to.equal(TokenURIdata);
    }); 

    it("should not return tokenURI if not exists", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      const TokenURIdata = "data:application/json;base64,eyJuYW1lIjogIkdvbGRDaGFpbiBDZXJ0aWZpY2F0ZSBORlQgIzAiLCAiYXR0cmlidXRlcyI6IFt7InRyYWl0X3R5cGUiOiAiSmV3ZWxlck5hbWUiLCJ2YWx1ZSI6ICJCaWpvdXRlcmllIEpvbGllIn0seyJ0cmFpdF90eXBlIjogIm1haW5NYXRlcmlhbCIsInZhbHVlIjogIjAifSx7InRyYWl0X3R5cGUiOiAibWFpbkdlbVN0b25lcyIsInZhbHVlIjogIjEifSx7InRyYWl0X3R5cGUiOiAid2VpZ2h0SW5HcmFtcyIsInZhbHVlIjogIjkifSx7InRyYWl0X3R5cGUiOiAiZGVzY3JpcHRpb24iLCJ2YWx1ZSI6ICJCYWd1ZSBlbiBvciBhdmVjIHVuIGRpYW1hbnQifSx7InRyYWl0X3R5cGUiOiAiQ2VydGlmaWNhdGVMZXZlbCIsInZhbHVlIjogIjAifV0sImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU9EQXdJaUJvWldsbmFIUTlJamd3TUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRGd3TUNBNE1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SStQSEpsWTNRZ2VEMGlNQ0lnZVQwaU1DSWdkMmxrZEdnOUlqZ3dNQ0lnYUdWcFoyaDBQU0k0TURBaUlHWnBiR3c5SWlObU9HWTVabUVpSUhOMGNtOXJaVDBpSTJRMFlXWXpOeUlnYzNSeWIydGxMWGRwWkhSb1BTSXhNQ0lnY25nOUlqSXdJaUJ5ZVQwaU1qQWlMejQ4ZEdWNGRDQjRQU0kxTUNVaUlIazlJakV5TUNJZ1ptOXVkQzF6YVhwbFBTSTFNQ0lnWm05dWRDMW1ZVzFwYkhrOUlrRnlhV0ZzTENCellXNXpMWE5sY21sbUlpQm1iMjUwTFhkbGFXZG9kRDBpWW05c1pDSWdabWxzYkQwaUl6TXpNeUlnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK1EyVnlkR2xtYVdOaGRDQk9SbFE4TDNSbGVIUStQSFJsZUhRZ2VEMGlOVEFsSWlCNVBTSXhPREFpSUdadmJuUXRjMmw2WlQwaU5EQWlJR1p2Ym5RdFptRnRhV3g1UFNKQmNtbGhiQ3dnYzJGdWN5MXpaWEpwWmlJZ1ptOXVkQzEzWldsbmFIUTlJbUp2YkdRaUlHWnBiR3c5SWlNek16TWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpUGtKaFozVmxJR1Z1SUc5eUlHRjJaV01nZFc0Z1pHbGhiV0Z1ZER3dmRHVjRkRDQ4Wld4c2FYQnpaU0JqZUQwaU5EQXdJaUJqZVQwaU5ESXdJaUJ5ZUQwaU1UZ3dJaUJ5ZVQwaU1UQXdJaUJtYVd4c1BTSnViMjVsSWlCemRISnZhMlU5SWlOa05HRm1NemNpSUhOMGNtOXJaUzEzYVdSMGFEMGlNakFpTHo0OFpXeHNhWEJ6WlNCamVEMGlOREF3SWlCamVUMGlOREl3SWlCeWVEMGlNVFF3SWlCeWVUMGlPREFpSUdacGJHdzlJbTV2Ym1VaUlITjBjbTlyWlQwaUkyWTRaamxtWVNJZ2MzUnliMnRsTFhkcFpIUm9QU0l5TUNJdlBqeHdiMng1WjI5dUlIQnZhVzUwY3owaU5EQXdMREkxTUNBME56QXNNekF3SURRM01Dd3pPREFnTkRBd0xEUXpNQ0F6TXpBc016Z3dJRE16TUN3ek1EQWlJR1pwYkd3OUluZG9hWFJsSWlCemRISnZhMlU5SWlNNFlUWm1NekFpSUhOMGNtOXJaUzEzYVdSMGFEMGlOU0l2UGp4c2FXNWxJSGd4UFNJME1EQWlJSGt4UFNJeU5UQWlJSGd5UFNJME1EQWlJSGt5UFNJME16QWlJSE4wY205clpUMGlJemhoTm1Zek1DSWdjM1J5YjJ0bExYZHBaSFJvUFNJeklpOCtQR3hwYm1VZ2VERTlJak16TUNJZ2VURTlJak13TUNJZ2VESTlJalEzTUNJZ2VUSTlJak00TUNJZ2MzUnliMnRsUFNJak9HRTJaak13SWlCemRISnZhMlV0ZDJsa2RHZzlJak1pTHo0OGJHbHVaU0I0TVQwaU5EY3dJaUI1TVQwaU16QXdJaUI0TWowaU16TXdJaUI1TWowaU16Z3dJaUJ6ZEhKdmEyVTlJaU00WVRabU16QWlJSE4wY205clpTMTNhV1IwYUQwaU15SXZQangwWlhoMElIZzlJalV3SlNJZ2VUMGlOakF3SWlCbWIyNTBMWE5wZW1VOUlqUXdJaUJtYjI1MExXWmhiV2xzZVQwaVFYSnBZV3dzSUhOaGJuTXRjMlZ5YVdZaUlHWnZiblF0ZDJWcFoyaDBQU0ppYjJ4a0lpQm1hV3hzUFNJalpEUmhaak0zSWlCMFpYaDBMV0Z1WTJodmNqMGliV2xrWkd4bElqNUNhV3B2ZFhSbGNtbGxJRXB2YkdsbFBDOTBaWGgwUGp4eVpXTjBJSGc5SWpJd01DSWdlVDBpTmpVd0lpQjNhV1IwYUQwaU5EQXdJaUJvWldsbmFIUTlJamd3SWlCbWFXeHNQU0ozYUdsMFpTSWdjM1J5YjJ0bFBTSWpNek16SWlCemRISnZhMlV0ZDJsa2RHZzlJak1pSUhKNFBTSXhNQ0lnY25rOUlqRXdJaTgrUEhSbGVIUWdlRDBpTlRBbElpQjVQU0kzTURBaUlHWnZiblF0YzJsNlpUMGlNekFpSUdadmJuUXRabUZ0YVd4NVBTSkJjbWxoYkN3Z2MyRnVjeTF6WlhKcFppSWdabWxzYkQwaUl6TXpNeUlnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK01Ed3ZkR1Y0ZEQ0OEwzTjJaejQ9In0="
      await goldChain.connect(jeweler1).createJeweler("Bijouterie Jolie", JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 1, 9, "Bague en or avec un diamant", 0, "Bijouterie Jolie", 0);
      await expect(goldChain.connect(jeweler1).tokenURI(2)).to.be.revertedWithCustomError(
        goldChain,
        "TokenDoesNotExist"
      );
    }); 
  });

  describe("update jeweler", function () {
    it("should update a jeweler name", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler1).updateJeweler(JEWELER2NAME, JEWELER1EMAIL, JEWELER1LOCATION, VISIBLE);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.name).to.equal(JEWELER2NAME);
    });

    it("should not update a jeweler if not exists", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await expect(goldChain.connect(jeweler1).updateJeweler(JEWELER2NAME, JEWELER2EMAIL, JEWELER2LOCATION, VISIBLE)).to.be.revertedWithCustomError(
        goldChain,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("should update a jeweler email", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler1).updateJeweler(JEWELER1NAME, JEWELER2EMAIL, JEWELER1LOCATION, VISIBLE);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.email).to.equal(JEWELER2EMAIL);
    });

    it("should update a jeweler location", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler1).updateJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER2LOCATION, VISIBLE);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.location).to.equal(JEWELER2LOCATION);
    });

    it("should update a jeweler visibility", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler1).updateJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION, NOT_VISIBLE);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.visible).to.equal(false);
    });

    it("should emit jewelerUpdated event", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture); 
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);     
      await expect(goldChain.connect(jeweler1).updateJeweler(JEWELER2NAME, JEWELER2EMAIL, JEWELER2LOCATION, VISIBLE))
      .to.emit(goldChain,
        "jewelerUpdated"
        ).withArgs(jeweler1.address, anyValue); 
    });    
  });

  describe("certificate", function () {
    it("should create a certificate", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      expect(await goldChain.balanceOf(jeweler1.address)).to.equal(1);
    });

    it("should not create a certificate if not registered", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(admin).desactivateJeweler(jeweler1.address);
      await expect(goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0)).to.be.revertedWithCustomError(
        goldChain,  
        "NotRegistered"
      );
    });

    it("should not create a certificate if not jeweler", async function () {
      const { goldChain, jeweler1, customer1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await expect(goldChain.connect(customer1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0)).to.be.revertedWithCustomError(
        goldChain,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("should create a certificate whith correct jeweler name", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.JewelerName).to.equal("jeweler1");
    });

    it("should create a certificate whith correct material", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(1, 0, 8, "alliance", 0, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.materials).to.equal(1);
    });

    it("should create a certificate whith correct gemstone", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 2, 8, "alliance", 0, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.gemStones).to.equal(2);
    });

    it("should create a certificate whith correct weight", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.weightInGrams).to.equal(8);
    });

    it("should create a certificate whith correct description", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.mainColor).to.equal("alliance");
    });

    it("should create a certificate whith correct certificate level", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 1, "jeweler1", 0);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.level).to.equal(1);
    });

    it("should create a certificate whith correct certificate status", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 1, "jeweler1", 1);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.status).to.equal(1);
    });
    
    it("should update a certificate status", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      await goldChain.connect(jeweler1).updateCertificateStatus(0, 3);
      let cert = await goldChain.getOneCertificate(0);
      expect(cert.status).to.equal(3);
    });

    it("should not update a certificate status if not exists", async function () {
      const { goldChain, jeweler1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      await expect(goldChain.connect(jeweler1).updateCertificateStatus(1, 3)).to.be.revertedWithCustomError(
        goldChain,
        "ERC721NonexistentToken"
      );
    });

    it("should not update a certificate status if not owner", async function () {
      const { goldChain, jeweler1, jeweler2, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(jeweler2).createJeweler(JEWELER2NAME, JEWELER2EMAIL, JEWELER2LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      await expect(goldChain.connect(jeweler2).updateCertificateStatus(0, 3)).to.be.revertedWithCustomError(
        goldChain,
        "NotOwner"
      );
    });

    it("should transfert a certificate to a new owner", async function () {
      const { goldChain, jeweler1, customer1, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      await goldChain.connect(jeweler1).safeTransferFrom(jeweler1.address, customer1.address, 0);
      expect(await goldChain.ownerOf(0)).to.equal(customer1.address);
    });

    it("should not transfert a certificate to a new owner if not authorized", async function () {
      const { goldChain, jeweler1, customer1, customer2, admin } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await goldChain.connect(customer2).createCustomer(CUSTOMER2NAME, CUSTOMER2EMAIL, CUSTOMER2LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(jeweler1).createCertificate(0, 0, 8, "alliance", 0, "jeweler1", 0);
      await expect(goldChain.connect(customer2).safeTransferFrom(jeweler1.address, customer1.address, 0)).to.be.revertedWithCustomError(
        goldChain,
        "ERC721InsufficientApproval"
      );
    });
  });


  describe("add customer", function () {
    it("should add a customer", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      expect(await goldChain.getCustomerCount()).to.equal(1);
    });

    it("should not add a customer if already exists", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await expect(goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION)).to.be.revertedWithCustomError(
        goldChain,
        "CustomerIsAlreadyRegistered"
      );
    });

    it("should add a customer with correct name", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.name).to.equal(CUSTOMER1NAME);
    });

    it("should add a customer with correct email", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.email).to.equal(CUSTOMER1EMAIL);
    });

    it("should add a customer with correct location", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.location).to.equal(CUSTOMER1LOCATION);
    });

    it("should add a customer with correct visible status", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.visible).to.equal(VISIBLE);
    });

  });

  describe("update customer", function () {
    it("should update a customer name", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await goldChain.connect(customer1).updateCustomer(CUSTOMER2NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, VISIBLE);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.name).to.equal(CUSTOMER2NAME);
    });

    it("should not update a customer if not exists", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await expect(goldChain.connect(customer1).updateCustomer(CUSTOMER2NAME, CUSTOMER2EMAIL, CUSTOMER2LOCATION, VISIBLE)).to.be.revertedWithCustomError(
        goldChain,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("should update a customer email", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await goldChain.connect(customer1).updateCustomer(CUSTOMER1NAME, CUSTOMER2EMAIL, CUSTOMER1LOCATION, VISIBLE);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.email).to.equal(CUSTOMER2EMAIL);
    });

    it("should update a customer visibility", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await goldChain.connect(customer1).updateCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION, NOT_VISIBLE);
      let cust = await goldChain.getOneCustomer(customer1.address);
      expect(cust.visible).to.equal(false);
    });

    it("should emit customerUpdated event", async function () {
      const { goldChain, customer1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(customer1).createCustomer(CUSTOMER1NAME, CUSTOMER1EMAIL, CUSTOMER1LOCATION);
      await expect(goldChain.connect(customer1).updateCustomer(CUSTOMER2NAME, CUSTOMER2EMAIL, CUSTOMER2LOCATION, VISIBLE))
      .to.emit(goldChain,
        "customerUpdated"
        ).withArgs(customer1.address, anyValue); 
    });
  });

  describe("ADMIN functions", function () {
    it("should activate a jeweler", async function () {
      const { goldChain, admin, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.available).to.equal(AVAILABLE);
    });

    it("should desactivate a jeweler", async function () {
      const { goldChain, admin, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await goldChain.connect(admin).desactivateJeweler(jeweler1.address);
      let jew = await goldChain.getOneJeweler(jeweler1.address);
      expect(jew.available).to.equal(NOT_AVAILABLE);
    });

    it("should emit jewelerActivated event", async function () {
      const { goldChain, admin, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await expect(goldChain.connect(admin).activateJeweler(jeweler1.address))
      .to.emit(goldChain,
        "jewelerActivated"
        ).withArgs(jeweler1.address, anyValue); 
    }); 

    it("should emit jewelerDesactivated event", async function () {
      const { goldChain, admin, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await goldChain.connect(admin).activateJeweler(jeweler1.address);
      await expect(goldChain.connect(admin).desactivateJeweler(jeweler1.address))
      .to.emit(goldChain,
        "jewelerDesactivated"
        ).withArgs(jeweler1.address, anyValue); 
    });

    it("should not activate a jeweler if not admin", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await expect(goldChain.connect(jeweler1).activateJeweler(jeweler1.address)).to.be.revertedWithCustomError(
        goldChain,
        "AccessControlUnauthorizedAccount").withArgs(
          jeweler1.address, anyValue
        );
    });

    it("should not desactivate a jeweler if not admin", async function () {
      const { goldChain, jeweler1 } = await loadFixture(deployGoldChainFixture);
      await goldChain.connect(jeweler1).createJeweler(JEWELER1NAME, JEWELER1EMAIL, JEWELER1LOCATION);
      await expect(goldChain.connect(jeweler1).desactivateJeweler(jeweler1.address)).to.be.revertedWithCustomError(
        goldChain,  
        "AccessControlUnauthorizedAccount").withArgs(
          jeweler1.address, anyValue
        );
    });

  });

  describe("Interface Support", function () {
    it("Should support ERC721 interface", async function () {
        const ERC721_INTERFACE_ID = "0x80ac58cd";
        const { goldChain} = await loadFixture(deployGoldChainFixture);
        expect(await goldChain.supportsInterface(ERC721_INTERFACE_ID)).to.be.true;
    });

    it("Should not support unknown interface", async function () {
        const UNKNOWN_INTERFACE_ID = "0xffffffff";
        const { goldChain} = await loadFixture(deployGoldChainFixture);
        expect(await goldChain.supportsInterface(UNKNOWN_INTERFACE_ID)).to.be.false;
    });
});

});