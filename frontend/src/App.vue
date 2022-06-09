<template>
   <div class="container" v-if="ready">
      <h1 class="text-center">Lottery</h1>
      <p>House Fee: {{ houseFee }}</p>
      <p>State: {{ store.getLotteryStatus }} </p>
      <p>Bet size: {{ betSize }} </p>
      <p>Bet count: {{ betCount }} </p>
      <div>
        <h2>Players</h2>
        <ul>
          <li v-for="player in players" :key="player">
            {{ player }}
          </li>
        </ul>
      </div>
      <BettingAdmin></BettingAdmin>
      <ExecuteBet></ExecuteBet>
    </div>
</template>

<script>

import BettingAdmin from './components/BettingAdmin.vue';
import ExecuteBet from './components/ExecuteBet.vue';
//import { mapStores } from 'pinia'
import { useStore } from './store/lottery.js'
import { computed } from "vue";


export default {
  name: 'App',
  components: {
    BettingAdmin,
    ExecuteBet
  },
  setup() {
    const store = useStore();

    (async () => {
      await store.registerWeb3();
    })()

    const ready = true;

    return {
      store,
      houseFee: computed(() => store.bettingFee),
      betStatus: computed(() => store.currentStatus),
      betSize: computed(() => store.bettingSize),
      betCount: computed(() => store.playerCount),
      players: computed(() => store.players),
      ready
    }
  }
}
</script>


