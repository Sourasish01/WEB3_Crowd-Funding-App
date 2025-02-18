// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrowdfundingModule", (m) => {
  // Deploy the CrowdFunding contract
  const crowdfunding = m.contract("CrowdFunding");

  // Return the deployed contract instance
  return { crowdfunding };
});

