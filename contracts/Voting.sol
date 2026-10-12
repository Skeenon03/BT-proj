// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Simple E-Voting contract
/// @notice Admin adds candidates, each address votes once, admin can end the election.
contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public admin;
    bool public electionOpen = true;
    Candidate[] private candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint256 indexed id, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event ElectionEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(string[] memory names) {
        admin = msg.sender;
        for (uint256 i = 0; i < names.length; i++) {
            _addCandidate(names[i]);
        }
    }

    function _addCandidate(string memory name) private {
        require(bytes(name).length > 0, "Name required");
        uint256 id = candidates.length;
        candidates.push(Candidate(id, name, 0));
        emit CandidateAdded(id, name);
    }

    function addCandidate(string calldata name) external onlyAdmin {
        require(electionOpen, "Election ended");
        _addCandidate(name);
    }

    function vote(uint256 candidateId) external {
        require(electionOpen, "Election ended");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");
        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;
        emit Voted(msg.sender, candidateId);
    }

    function endElection() external onlyAdmin {
        require(electionOpen, "Already ended");
        electionOpen = false;
        emit ElectionEnded();
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }
}
