import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app')
