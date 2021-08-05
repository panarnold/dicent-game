import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Instructions from "../views/Instructions.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/instructions",
    name: "Instructions",
    component: Instructions,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
