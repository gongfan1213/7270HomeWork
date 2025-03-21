<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">用户注册</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">用户名</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="username"
                required
              />
            </div>
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
            <div class="mb-3">
              <label for="password2" class="form-label">确认密码</label>
              <input
                type="password"
                class="form-control"
                id="password2"
                v-model="password2"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>
          <div class="mt-3">
            <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password2: '',
      loading: false,
      error: null
    };
  },
  methods: {
    ...mapActions('auth', ['register']),
    async onSubmit() {
      if (this.password !== this.password2) {
        this.error = '两次输入的密码不一致';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        await this.register({
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.msg || '注册失败，请稍后再试';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>