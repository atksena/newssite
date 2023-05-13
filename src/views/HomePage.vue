<template>
  <v-app>
    <v-main>
      <v-container>
        <v-app-bar
          color="#6A76AB"
          dark
          shrink-on-scroll
          prominent
          src="https://picsum.photos/1920/1080?random"
          fade-img-on-scroll
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
            ></v-img>
          </template>
          <v-app-bar-title style="color: white">News</v-app-bar-title>
          <v-toolbar flat color="transparent" class="mt-3">
            <v-toolbar-items class="ml-auto">
              <v-text-field
                hide-details
                placeholder="Search"
                v-model="searchQuery"
              ></v-text-field>
              <v-btn
                depressed
                class="mr-5"
                style="height: 36px !important; padding: 10px !important"
                v-bind:style="{ 'background-color': 'transparent' }"
                @click="searchNews"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
              <v-select
                hide-details
                class="mr-5"
                v-model="selectedSource"
                :items="filteredNewspapers"
                label="News Sources"
                @change="goToSourcePage"
              ></v-select>
              <template>
                <v-row justify="center">
                  <v-dialog v-model="dialog" scrollable max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind:style="{ 'background-color': 'transparent' }"
                        style="height: 60px"
                        depressed
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-star-check</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>Newspaper List</v-card-title>
                      <v-card-text>
                        <div
                          v-for="newspaper in newspapers"
                          :key="newspaper.value"
                        >
                          <v-checkbox
                            dense
                            @change="favoritesChanged()"
                            :label="newspaper.text"
                            v-model="favoriteNewspapers"
                            :value="newspaper.value"
                          ></v-checkbox>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-row>
              </template>
            </v-toolbar-items>
          </v-toolbar>
          <template v-slot:extension>
            <v-tabs align-with-title v-model="tabIndex">
              <v-tab
                class="mr-4 white--text"
                v-for="tab in tabs"
                :key="tab.value"
                @click="tabSelected(tab.value)"
              >
                {{ tab.text }}
              </v-tab>
            </v-tabs>
          </template>
        </v-app-bar>
        <router-view :parentFunction="parentFunction"></router-view>
      </v-container>
    </v-main>
    <v-sheet class="overflow-y-auto">
      <v-container style="height: 1000px"></v-container>
    </v-sheet>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "HomePage",
  data() {
    return {
      articles: [],
      newspapers: [],
      favoriteNewspapers: [],
      selectedSource: null,
      dialog: false,
      tabs: [
        { text: "General", value: "general" },
        { text: "Business", value: "business" },
        { text: "Sports", value: "sports" },
        { text: "Entertainment", value: "entertainment" },
        { text: "Health", value: "health" },
        { text: "Science", value: "science" },
        { text: "Technology", value: "technology" },
      ],
      selectedCategory: null,
      selectedNews: null,
      searchQuery: null,
      tabIndex: 0,
    };
  },
  computed: {
    isFavorite() {
      return this.favoriteNewspapers.includes(this.selectedSource);
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
  methods: {
    parentFunction(action) {
      if (action === "refreshLS") {
        this.getLocalStorage();
      }
    },
    favoritesChanged() {
      localStorage.setItem(
        "favoriteNewspapers",
        JSON.stringify(this.favoriteNewspapers)
      );
    },
    tabSelected(value) {
      if (value !== null) {
        this.selectedSource = null;
        this.searchQuery = null;
        this.selectedCategory = value;
        this.$router.push(`/categories/${this.selectedCategory}`);
      }
    },
    fetchNewspapers() {
      axios
        .get("https://newsapi.org/v2/sources", {
          params: {
            apiKey: "4055ac47fcee4039b5479e6ea653d6e8",
          },
        })
        .then((response) => {
          this.newspapers = response.data.sources.map((source) => {
            return {
              text: source.name,
              value: source.id,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goToSourcePage() {
      if (this.selectedSource !== null) {
        this.searchQuery = null;
        if (this.selectedSource) {
          this.$router.push(`/news/${this.selectedSource}`);
        }
      }
    },
    fetchNews() {
      axios
        .get("https://newsapi.org/v2/top-headlines", {
          params: {
            language: "en",
            apiKey: "4055ac47fcee4039b5479e6ea653d6e8",
            category: this.selectedCategory,
          },
        })
        .then((response) => {
          this.articles = response.data.articles;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchNews() {
      if (this.searchQuery) {
        this.$router.push(`/query/${this.searchQuery}`);
      }
    },
    getLocalStorage() {
      if (localStorage.getItem("favoriteNewspapers") !== null) {
        this.favoriteNewspapers = JSON.parse(
          localStorage.getItem("favoriteNewspapers")
        );
      }
    },
  },
  created() {
    this.getLocalStorage();
    this.fetchNewspapers();
    this.fetchNews();
    if (this.$route.params.category) {
      this.tabIndex = this.tabs.findIndex(
        (t) => t.value === this.$route.params.category
      );
    }
    if (this.$route.params.newsId) {
      this.selectedSource = this.$route.params.newsId;
    }
  },
};
</script>
