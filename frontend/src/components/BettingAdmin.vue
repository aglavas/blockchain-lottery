<template>
   <div v-if="store.isAdminConnected">
      <div class="row" v-if="store.hasBettingStarted">
        <div class="col-sm-12">
            <h2>Cancel bet</h2>
              <button @click="cancelBet" class="btn btn-primary">Submit</button>
          </div>
      </div>
      <div class="row" v-else>
        <div class="col-sm-12">
          <h2>Create bet</h2>
          <form @submit="createBet">
            <div class="form-group">
              <label for="count">Count</label>
              <input v-model="create.count" type="text" class="form-control" id="count" />
            </div>
            <div class="form-group">
              <label for="size">Size</label>
              <input v-model="create.size" type="text" class="form-control" id="size" />
            </div>
            <br>
            <ValidationErrors :errors="create.errors"></ValidationErrors>
            <br>
            <p class="h2">{{ createResult }}</p>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  
</template>

<script>
import { useStore } from '../store/lottery.js'
import Lottery from '../models/lottery.js'
import ValidationErrors from './ValidationErrors.vue';
import { computed } from "vue";

export default {
  name: 'BettingAdmin',
  components: {
    ValidationErrors
  },
  setup() {
    const store = useStore();

    let create = {
      count: null,
      size: null,
      errors: [],
    };

    let cancel = {
      result: null
    };

    return {
      store,
      create,
      cancel,
      createResult: computed(() => store.createResult),
    }
  },
  methods: {
    createBet: async function (e) {
      e.preventDefault();

      let error = false;
      this.create.errors = [];

      if (!this.create.count) {
        this.create.errors.push('Count is required.');
        error = true;
      }

      if (!this.create.size) {
        this.create.errors.push('Size is required.');
        error = true;
      }

      if (error) {
        return false;
      }

      await Lottery.createBet(this.create.count, this.create.size);

      this.create.count = '';
      this.create.size = '';
    },
    cancelBet: async function () {
      await Lottery.cancelBet();
      return true;  
    }
  }
}
</script>


