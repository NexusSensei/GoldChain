const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTGoldChain", function () {
    let NFTGoldChain;
    let nftGoldChain;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy contract
        NFTGoldChain = await ethers.getContractFactory("GoldChainERC721");
        nftGoldChain = await NFTGoldChain.deploy();
        await nftGoldChain.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await nftGoldChain.name()).to.equal("GoldChainERC721");
            expect(await nftGoldChain.symbol()).to.equal("GC");
        });
    });

    describe("Minting", function () {
        it("Should mint a new token", async function () {
            await nftGoldChain.safeMint(addr1.address);
            expect(await nftGoldChain.ownerOf(0)).to.equal(addr1.address);
        });

        it("Should increment token ID correctly", async function () {
            await nftGoldChain.safeMint(addr1.address);
            await nftGoldChain.safeMint(addr2.address);
            expect(await nftGoldChain.ownerOf(0)).to.equal(addr1.address);
            expect(await nftGoldChain.ownerOf(1)).to.equal(addr2.address);
        });
    });

    describe("Token URI", function () {
        it("Should return empty string for non-existent token", async function () {
            expect(await nftGoldChain.tokenURI(0)).to.equal("");
        });

        it("Should return token URI for existing token", async function () {
            await nftGoldChain.safeMint(addr1.address);
            const tokenURI = await nftGoldChain.tokenURI(0);
            expect(tokenURI).to.equal("");
        });

        it("Should encode text in base64 correctly", async function () {
            const textToEncode = "Ceci est un test de l'encodage base64";
            const bytes = ethers.toUtf8Bytes(textToEncode);
            const encodedText = await nftGoldChain.Base64Encode(bytes);
            const expectedBase64 = Buffer.from(textToEncode).toString('base64');
            expect(encodedText).to.equal(expectedBase64);
        });

        it("Should not encode empty text", async function () {
            const textToEncode = "";
            const bytes = ethers.toUtf8Bytes(textToEncode);
            const encodedText = await nftGoldChain.Base64Encode(bytes);
            const expectedBase64 = Buffer.from(textToEncode).toString('base64');
            expect(encodedText).to.equal(expectedBase64);
        });

        // it("Should return valid base64 encoded URI", async function () {
        //     await nftGoldChain.safeMint(addr1.address);
        //     const tokenURI = await nftGoldChain.tokenURI(0);
        //     // Vérifie que l'URI commence par data:application/json;base64,
        //     expect(tokenURI).to.include("data:application/json;base64,");
        //     // Vérifie que le reste est en base64 valide
        //     const base64Part = tokenURI.split(",")[1];
        //     expect(base64Part).to.match(/^[A-Za-z0-9+/=]+$/);
        // });
    });

    describe("Transfer", function () {
        beforeEach(async function () {
            await nftGoldChain.safeMint(addr1.address);
        });

        it("Should transfer token correctly", async function () {
            await nftGoldChain.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
            expect(await nftGoldChain.ownerOf(0)).to.equal(addr2.address);
        });

        it("Should fail when non-owner tries to transfer", async function () {
            await expect(
                nftGoldChain.connect(addr2).transferFrom(addr1.address, addr2.address, 0)
            ).to.be.revertedWithCustomError(nftGoldChain, "ERC721InsufficientApproval");
        });
    });

    describe("Balance", function () {
        it("Should update balance after minting", async function () {
            await nftGoldChain.safeMint(addr1.address);
            expect(await nftGoldChain.balanceOf(addr1.address)).to.equal(1);
        });

        it("Should update balance after transfer", async function () {
            await nftGoldChain.safeMint(addr1.address);
            await nftGoldChain.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
            expect(await nftGoldChain.balanceOf(addr1.address)).to.equal(0);
            expect(await nftGoldChain.balanceOf(addr2.address)).to.equal(1);
        });
    });

    describe("Interface Support", function () {
        it("Should support ERC721 interface", async function () {
            const ERC721_INTERFACE_ID = "0x80ac58cd";
            expect(await nftGoldChain.supportsInterface(ERC721_INTERFACE_ID)).to.be.true;
        });

        it("Should not support unknown interface", async function () {
            const UNKNOWN_INTERFACE_ID = "0xffffffff";
            expect(await nftGoldChain.supportsInterface(UNKNOWN_INTERFACE_ID)).to.be.false;
        });
    });

}); 