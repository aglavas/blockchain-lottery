import { defineStore } from 'pinia'
import { getWeb3, connect } from '../utils.js'
import Lottery from '../../../build/contracts/Lottery.json'

export const useStore = defineStore('lottery', {
  state: () => {
    return {
      web3: null,
      accounts: null,
      adminAccount: null,
      currentAccount: null,
      networkId: null,
      contract: null,
      bettingFee: null,
      bettingSize: null,
      playerCount: null,
      currentStatus: null,
      createResult: null,
      cancelResult: null,
      betResult: null,
      players: [],
    }
  },
  getters: {
    isAdminConnected(state) {
        if (!state.adminAccount || !state.currentAccount) {
            return false;
        }

        if (state.adminAccount.toUpperCase() == state.currentAccount.toUpperCase()) {
            return true;
        }
        
        return false;
    },
    hasLotteryStarted(state) {
        if (!state.currentStatus) {
            return false;
        }

        if (state.currentStatus == 0) {
            return false;
        }
        
        return true;
    },
    getLotteryStatus(state) {
        if (!state.currentStatus || state.currentStatus == 0) {
            return 'NOT ACTIVE';
        }

        return 'ACTIVE';
    },
    hasBettingStarted(state) {
        if (!state.currentStatus || state.currentStatus == 0) {
            return false;
        }

        return true;
    }
  },
  actions: {
    async registerWeb3() {
        this.web3 = await getWeb3();
        this.accounts = await this.web3.eth.getAccounts();
        this.networkId = await this.web3.eth.net.getId();

        let deployedNetwork = Lottery.networks[this.networkId];        
        this.contract = new this.web3.eth.Contract(
            Lottery.abi,
            deployedNetwork && deployedNetwork.address,
        );
        this.currentAccount = await connect();
        this.adminAccount = await this.contract.methods.admin().call();
        await this.refreshBettingData();
    },
    async refreshBettingData() {
        const [fee, size, count, status, players] = await Promise.all([
            this.contract.methods.lotteryFee().call(),
            this.contract.methods.size().call(),
            this.contract.methods.count().call(),
            this.contract.methods.currentStatus().call(),
            this.contract.methods.getPlayers().call(),
            
        ]);
        
        this.bettingFee = fee;
        this.bettingSize = size;
        this.playerCount = count;
        this.currentStatus = status;
        this.players = players;
    },
    async refreshBettingStatus() {
        const [size, count, status, players] = await Promise.all([
            this.contract.methods.size().call(),
            this.contract.methods.count().call(),
            this.contract.methods.currentStatus().call(),
            this.contract.methods.getPlayers().call(),
        ]);
        
        this.bettingSize = size;
        this.playerCount = count;
        this.currentStatus = status;
        this.players = players;
    }
  }
})