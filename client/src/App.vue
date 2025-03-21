<template>
  <div id="app">
    <Navbar />
    <div class="container mt-4">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  created() {
    // 检查本地存储中的token
    const token = localStorage.getItem('token');
    if (token) {
      this.$store.dispatch('auth/loadUser');
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}
</style>