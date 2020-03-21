import Vue from 'vue';
import Session from '@/components/Session.vue';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(Session),
}).$mount('#app');
