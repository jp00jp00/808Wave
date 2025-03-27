import { createRouter, createWebHistory } from "vue-router";

import Home from '../views/home.vue';
import Detail from '../views/detail.vue';

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/detail/:beat", name: "Detail", component: Detail },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
