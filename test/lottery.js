const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Lottery = artifacts.require('Lottery.sol');

const balances = async addresses => {
  const balanceResults = await Promise.all(addresses.map(address =>
    web3.eth.getBalance(address)
  ));
  return balanceResults.map(balance => web3.utils.toBN(balance));
};

contract('Lottery', (accounts) => {
  let lottery;

  beforeEach(async () => {
    lottery = await Lottery.new(10);
  });
  
  it('Should NOT init bet if not admin', async () => {
    await expectRevert(lottery.initBet(3, 200, {from: accounts[1]}), 'Only admin action.');
  });

  it('Should NOT init bet if not idle', async () => {
    await lottery.initBet(3, 200, {from: accounts[0]})
    await expectRevert(lottery.initBet(3, 200, {from: accounts[0]}), 'Current status is different.');
  });

  it('Should init bet', async () => {
    await lottery.initBet(3, 200, {from: accounts[0]})
    let count = await lottery.count();
    let size = await lottery.size();
    let status = await lottery.currentStatus();
    assert(count.toNumber() === 3);
    assert(size.toNumber() === 200);
    assert(status.toNumber() === 1);
  });

  it('Should NOT bet if not BETTING', async () => {
    await expectRevert(lottery.bet({value: 200, from: accounts[1]}), 'Current status is different.');
  });

  it('Should NOT bet if amount is not correct', async () => {
    await lottery.initBet(3, 200, {from: accounts[0]})
    await expectRevert(lottery.bet({value: 100, from: accounts[1]}), 'Can bet only predefined WEI value.');
  });

  it('Should bet', async () => {
    const players = [accounts[1], accounts[2], accounts[3]];
    await lottery.initBet(3, web3.utils.toWei('1', 'ether'));

    const balancesBefore = await balances(players); 
    const txs = await Promise.all(players.map(player => lottery.bet({
      value: web3.utils.toWei('1', 'ether'), 
      from: player,
      gasPrice: 1,
      gas: 3000000
    })))
    const balancesAfter = await balances(players); 
    const result = players.some((_player, i) => {
      const gasUsed = web3.utils.toBN(txs[i].receipt.gasUsed);
      const expected = web3.utils.toBN(web3.utils.toWei('1.7', 'ether'));
      return balancesAfter[i].sub(balancesBefore[i]).add(gasUsed).eq(expected);
    });

    assert(result === true);
  });

  it('Should NOT cancel if status is not betting', async () => {
    await expectRevert(lottery.cancelBet({from: accounts[0]}), 'Current status is different.');
  });

  it('Should NOT cancel if not admin', async () => {
    await lottery.initBet(3, 100, {from: accounts[0]});
    await expectRevert(lottery.cancelBet({from: accounts[1]}), 'Only admin action.');
  });

  it('Should cancel', async () => {
    await lottery.initBet(3, 100);
    await lottery.cancelBet();
    const state = await lottery.currentStatus();
    assert(state.toNumber() === 0);
  });
});