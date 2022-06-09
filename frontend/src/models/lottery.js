import { useStore } from '../store/lottery.js'

export default {
  async createBet(playerCount, betSize) {
    const store = useStore();
    const createBetPromise = store.contract.methods.initBet(playerCount, betSize).send({from: store.currentAccount, gas: 3000000});
    createBetPromise.then(() => {
        store.createResult = 'Betting has been created'
        store.refreshBettingStatus();
    }).catch((error) => {
        store.createResult = error
    });

    return true;
  },
  async cancelBet() {
    const store = useStore();
    const cancelBetPromise = store.contract.methods.cancelBet().send({from: store.currentAccount, gas: 3000000});
    cancelBetPromise.then(() => {
        store.cancelResult = 'Betting has been canceled'
        store.refreshBettingStatus();
    }).catch((error) => {
        store.cancelResult = error
    });

    return true;
  },
  async bet() {
    const store = useStore();
    const betPromise = store.contract.methods.bet().send({from: store.currentAccount, gas: 3000000, value: store.bettingSize});
    betPromise.then(() => {
        store.betResult = 'Betted successfully'
        store.refreshBettingStatus();
    }).catch((error) => {
        store.betResult = error
    });

    return true;
  }
}
