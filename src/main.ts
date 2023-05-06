import 'core-js';

import { createApp } from 'vue';
import App from './App.vue';

import { createWebHistory, createRouter } from "vue-router";
import { createMetaManager } from "vue-meta";

/** 
 *Still waiting for bootstrap-vue 3
          **/
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import jquery from 'jquery/dist/jquery.min.js';

import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';

import Index from "./components/Index.vue";

const routes = [
    {path: '/', component: Index},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

const app = createApp(App);
app.use(router);
app.use(createMetaManager());
app.use(jquery);
app.use(bootstrap);
app.use(VueSweetalert2);
app.mount('#app');
