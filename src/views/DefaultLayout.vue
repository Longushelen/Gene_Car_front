<template>

<main class="flex-shrink-0">
    <!-- Gnb -->
    <GNB></GNB>
    <router-view></router-view>
    <Footer-Layout></Footer-Layout>
</main>

</template>

<script>
import GNB from "../components/GNB.vue";
import FooterLayout from "../components/FooterLayout.vue";

export default {
  name: "MainView",
  components: {
    GNB,
    FooterLayout
  },
  methods: {},
};
</script>