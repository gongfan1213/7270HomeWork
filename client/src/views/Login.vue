<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">用户登录</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">邮箱</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">密码</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
          <div class="mt-3">
            <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async onSubmit() {
      this.loading = true;
      this.error = null;
      
      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.msg || '登录失败，请检查您的凭据';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>