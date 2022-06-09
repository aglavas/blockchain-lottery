// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
  enum Status {
    IDLE,
    BETTING
  }
  Status public currentStatus = Status.IDLE;
  address payable[] public players;
  address public admin;
  uint public count;
  uint public size;
  uint public lotteryFee;

  constructor(uint fee) {
    require(fee > 1 && fee < 99, 'fee should be between 1 and 99');
    lotteryFee = fee;
    admin = msg.sender;
  }

  function initBet(uint playerCount, uint betSize) external payable onlyAdmin() inStatus(Status.IDLE) {
    count = playerCount;
    size = betSize;
    currentStatus = Status.BETTING;
  }

  function bet() external payable inStatus(Status.BETTING) {
    require(msg.value == size, 'Can bet only predefined WEI value.');
    players.push(payable(msg.sender));
    if (count == players.length) {
      uint winner = randomIndex(count);
      players[winner].transfer((size * count) * (100 - lotteryFee) / 100);
      currentStatus = Status.IDLE;
      delete players;
    }
  }

  function cancelBet() external onlyAdmin() inStatus(Status.BETTING) {
    for (uint i = 0; i < players.length; i++) {
      players[i].transfer(size);
    }
    delete players;
    currentStatus = Status.IDLE;
  }

  function randomIndex(uint mod) internal view returns(uint) {
    return uint(keccak256(abi.encode(block.timestamp, block.difficulty))) % mod;
  }

  modifier inStatus(Status status) {
    require(currentStatus == status, 'Current status is different.');
    _;
  }

  modifier onlyAdmin() {
    require(admin == msg.sender, 'Only admin action.');
    _;
  }
}
