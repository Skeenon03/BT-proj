const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", () => {
  let voting, admin, a, b;
  beforeEach(async () => {
    [admin, a, b] = await ethers.getSigners();
    voting = await ethers.deployContract("Voting", [["X", "Y"]]);
  });

  it("starts with candidates and zero votes", async () => {
    const c = await voting.getCandidates();
    expect(c.length).to.equal(2);
    expect(c[0].voteCount).to.equal(0n);
  });

  it("counts a vote and blocks double voting", async () => {
    await voting.connect(a).vote(1);
    expect((await voting.getCandidates())[1].voteCount).to.equal(1n);
    await expect(voting.connect(a).vote(0)).to.be.revertedWith("Already voted");
  });

  it("rejects invalid candidate", async () => {
    await expect(voting.connect(a).vote(9)).to.be.revertedWith("Invalid candidate");
  });

  it("only admin can add candidates or end election", async () => {
    await expect(voting.connect(a).addCandidate("Z")).to.be.revertedWith("Only admin");
    await voting.addCandidate("Z");
    expect((await voting.getCandidates()).length).to.equal(3);
    await expect(voting.connect(a).endElection()).to.be.revertedWith("Only admin");
  });

  it("blocks voting after election ends", async () => {
    await voting.endElection();
    await expect(voting.connect(b).vote(0)).to.be.revertedWith("Election ended");
  });
});
