<template>
    <div class="row" v-if="store.hasBettingStarted">
        <div class="col-sm-12">
            <h2>Bet</h2>
            <p class="h2">{{ betResult }}</p>
            <button @click="bet" class="btn btn-primary">Submit</button>
        </div>
    </div>
    <div v-else>
        <br>
        <p class="h2">Waiting for betting to start</p>
    </div>
</template>

<script>
import { useStore } from '../store/lottery.js';
import Lottery from '../models/lottery.js';
import { computed } from "vue";

export default {
  name: 'ExecuteBet',
  setup() {
    const store = useStore();

    return {
      store,
      betResult: computed(() => store.betResult),
    }
  },
  methods: {
    bet: async function () {
      await Lottery.bet();
      return true;  
    }
  }
}
</script>


