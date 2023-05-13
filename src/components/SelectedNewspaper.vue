<template>
  <v-app>
    <v-main>
      <v-container>
        <div style="height: 50px; display: flex; align-items: center">
          <div style="flex: 1; text-align: left">
            <h2>{{ this.newspaperId }}</h2>
          </div>
          <div style="text-align: right" v-if="this.newspaperId">
            <v-btn
              depressed
              @click="saveFavorite"
              v-bind:style="{
                'background-color': 'transparent',
              }"
            >
              <v-icon>{{
                isFavorite ? "mdi-star" : "mdi-star-outline"
              }}</v-icon>
            </v-btn>
          </div>
        </div>
        <v-row class="my-4">
          <v-col
            class="d-flex"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="article in articles"
            :key="article.id"
          >
            <v-card class="mx-auto">
              <v-img v-if="!article.urlToImage" src="@/assets/download.png">
              </v-img>
              <v-img v-else :src="article.urlToImage" height="200"></v-img>
              <v-card-text class="text--primary">
                <div>
                  <h2>{{ article.title }}</h2>
                </div>
                <div>
                  <p>{{ article.description }}</p>
                </div>
                <div>
                  <p>{{ article.author }}</p>
                </div>
                <div>
                  <a target="_blank" :href="article.url">Devamını oku...</a>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "SelectedNewspaper",
  props: ["parentFunction"],
  computed: {
    newspaperId() {
      return this.$route.params.newsId;
    },
    isFavorite() {
      return this.favoriteNewspapers.includes(this.newspaperId);
    },
    filteredNewspapers() {
      if (this.favoriteNewspapers !== null) {
        const copiedNewspapers = [...this.newspapers];
        const newspaperIdList = copiedNewspapers.map(
          (newspaper) => newspaper.value
        );
        let newList = [];
        this.favoriteNewspapers.forEach((favId) => {
          if (newspaperIdList.includes(favId)) {
            const index = copiedNewspapers.findIndex((n) => n.value === favId);
            newList.push(copiedNewspapers[index]);
            copiedNewspapers.splice(index, 1);
          }
        });
        return [...newList, ...copiedNewspapers];
      } else {
        return this.newspapers;
      }
    },
  },
  data() {
    return {
      articles: [],
      favoriteNewspapers: [],
    };
  },
  methods: {
    goToSourcePage() {
      axios
        .get("https://newsapi.org/v2/top-headlines", {
          params: {
            sources: this.newspaperId,
            apiKey: "4055ac47fcee4039b5479e6ea653d6e8",
          },
        })
        .then((response) => {
          this.articles = response.data.articles;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveFavorite() {
      if (!this.favoriteNewspapers.includes(this.newspaperId)) {
        this.favoriteNewspapers.push(this.newspaperId);
        localStorage.setItem(
          "favoriteNewspapers",
          JSON.stringify(this.favoriteNewspapers)
        );
      } else {
        const index = this.favoriteNewspapers.indexOf(this.newspaperId);
        this.favoriteNewspapers.splice(index, 1);
        localStorage.setItem(
          "favoriteNewspapers",
          JSON.stringify(this.favoriteNewspapers)
        );
      }
      this.parentFunction("refreshLS");
    },
  },
  watch: {
    newspaperId() {
      this.goToSourcePage();
    },
  },
  created() {
    this.goToSourcePage();
    if (localStorage.getItem("favoriteNewspapers") !== null) {
      this.favoriteNewspapers = JSON.parse(
        localStorage.getItem("favoriteNewspapers")
      );
    }
  },
};
</script>
