<template>
  <v-app>
    <v-main>
      <v-container>
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
  name: "SearchNews",
  computed: {
    searchQuery() {
      return this.$route.params.query;
    },
  },
  data() {
    return {
      articles: [],
    };
  },
  methods: {
    searchNews() {
      axios
        .get("https://newsapi.org/v2/everything", {
          params: {
            language: "en",
            apiKey: "4055ac47fcee4039b5479e6ea653d6e8",
            q: this.searchQuery,
          },
        })
        .then((response) => {
          this.articles = response.data.articles;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.searchNews();
  },
  watch: {
    searchQuery() {
      this.searchNews();
    },
  },
};
</script>
