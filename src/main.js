import Vue from "vue";
import $axios from "@/plugins/axios";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "@/router";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");

Vue.prototype.axios = $axios;
