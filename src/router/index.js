import Vue from "vue";
import VueRouter from "vue-router";
import SelectedNewspaper from "@/components/SelectedNewspaper.vue";
import SelectedCategory from "@/components/SelectedCategory.vue";
import SearchNews from "@/components/SearchNews.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/news/:newsId", component: SelectedNewspaper },
  {
    path: "/categories/:category",
    component: SelectedCategory,
  },
  {
    path: "/",
    component: SelectedCategory,
  },
  { path: "/query/:query", component: SearchNews },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
