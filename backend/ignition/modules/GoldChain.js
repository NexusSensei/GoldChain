// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const dataAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

module.exports = buildModule("GoldChain", (m) => {
  const dataAddressparam = m.getParameter("dataAddress", dataAddress);

  const goldChain = m.contract("GoldChain", [dataAddressparam]);

  return { goldChain };
});
