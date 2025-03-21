<template>
  <div>
    <h1 class="mb-4">用户设置</h1>
    
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">个人资料</h5>
          </div>
          <div class="card-body">
            <div v-if="profileError" class="alert alert-danger">{{ profileError }}</div>
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="name" class="form-label">姓名</label>
                <input type="text" class="form-control" id="name" v-model="profile.name" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">邮箱</label>
                <input type="email" class="form-control" id="email" v-model="profile.email" required>
              </div>
              <div class="mb-3">
                <label for="gender" class="form-label">性别</label>
                <select class="form-select" id="gender" v-model="profile.gender">
                  <option value="">-- 选择性别 --</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="birthdate" class="form-label">出生日期</label>
                <input type="date" class="form-control" id="birthdate" v-model="profile.birthdate">
              </div>
              <div class="mb-3">
                <label for="height" class="form-label">身高 (cm)</label>
                <input type="number" class="form-control" id="height" v-model="profile.height">
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="profileLoading">
                {{ profileLoading ? '保存中...' : '保存个人资料' }}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">健康目标</h5>
          </div>
          <div class="card-body">
            <div v-if="goalsError" class="alert alert-danger">{{ goalsError }}</div>
            <form @submit.prevent="updateGoals">
              <div class="mb-3">
                <label for="targetWeight" class="form-label">目标体重 (kg)</label>
                <input type="number" step="0.1" class="form-control" id="targetWeight" v-model="goals.targetWeight">
              </div>
              <div class="mb-3">
                <label for="dailySteps" class="form-label">每日步数目标</label>
                <input type="number" class="form-control" id="dailySteps" v-model="goals.dailySteps">
              </div>
              <div class="mb-3">
                <label for="weeklyExercise" class="form-label">每周运动次数</label>
                <input type="number" class="form-control" id="weeklyExercise" v-model="goals.weeklyExercise">
              </div>
              <div class="mb-3">
                <label for="sleepHours" class="form-label">每日睡眠目标 (小时)</label>
                <input type="number" step="0.5" class="form-control" id="sleepHours" v-model="goals.sleepHours">
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="goalsLoading">
                {{ goalsLoading ? '保存中...' : '保存健康目标' }}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">账户安全</h5>
          </div>
          <div class="card-body">
            <div v-if="passwordError" class="alert alert-danger">{{ passwordError }}</div>
            <form @submit.prevent="updatePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">当前密码</label>
                <input type="password" class="form-control" id="currentPassword" v-model="passwordForm.currentPassword" required>
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">新密码</label>
                <input type="password" class="form-control" id="newPassword" v-model="passwordForm.newPassword" required>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">确认新密码</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="passwordForm.confirmPassword" required>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="passwordLoading">
                {{ passwordLoading ? '更新中...' : '更新密码' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">应用设置</h5>
      </div>
      <div class="card-body">
        <div v-if="preferencesError" class="alert alert-danger">{{ preferencesError }}</div>
        <form @submit.prevent="updatePreferences">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="language" class="form-label">语言</label>
                <select class="form-select" id="language" v-model="preferences.language">
                  <option value="zh-CN">中文 (简体)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="theme" class="form-label">主题</label>
                <select class="form-select" id="theme" v-model="preferences.theme">
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="weightUnit" class="form-label">体重单位</label>
                <select class="form-select" id="weightUnit" v-model="preferences.weightUnit">
                  <option value="kg">公斤 (kg)</option>
                  <option value="lb">磅 (lb)</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="distanceUnit" class="form-label">距离单位</label>
                <select class="form-select" id="distanceUnit" v-model="preferences.distanceUnit">
                  <option value="km">公里 (km)</option>
                  <option value="mi">英里 (mi)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="notifications" v-model="preferences.notifications">
            <label class="form-check-label" for="notifications">启用通知</label>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="reminders" v-model="preferences.reminders">
            <label class="form-check-label" for="reminders">启用提醒</label>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="preferencesLoading">
            {{ preferencesLoading ? '保存中...' : '保存应用设置' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Settings',
  data() {
    return {
      profile: {
        name: '',
        email: '',
        gender: '',
        birthdate: '',
        height: ''
      },
      goals: {
        targetWeight: '',
        dailySteps: '',
        weeklyExercise: '',
        sleepHours: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      preferences: {
        language: 'zh-CN',
        theme: 'light',
        weightUnit: 'kg',
        distanceUnit: 'km',
        notifications: true,
        reminders: true
      },
      profileLoading: false,
      goalsLoading: false,
      passwordLoading: false,
      preferencesLoading: false,
      profileError: null,
      goalsError: null,
      passwordError: null,
      preferencesError: null
    };
  },
  async mounted() {
    try {
      await this.fetchUserData();
    } catch (err) {
      console.error('获取用户数据失败:', err);
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get('/api/users/profile');
        const userData = response.data;
        
        // 填充个人资料
        this.profile = {
          name: userData.name || '',
          email: userData.email || '',
          gender: userData.gender || '',
          birthdate: userData.birthdate ? this.formatDateForInput(new Date(userData.birthdate)) : '',
          height: userData.height || ''
        };
        
        // 填充健康目标
        this.goals = {
          targetWeight: userData.goals?.targetWeight || '',
          dailySteps: userData.goals?.dailySteps || '',
          weeklyExercise: userData.goals?.weeklyExercise || '',
          sleepHours: userData.goals?.sleepHours || ''
        };
        
        // 填充应用设置
        if (userData.preferences) {
          this.preferences = {
            language: userData.preferences.language || 'zh-CN',
            theme: userData.preferences.theme || 'light',
            weightUnit: userData.preferences.weightUnit || 'kg',
            distanceUnit: userData.preferences.distanceUnit || 'km',
            notifications: userData.preferences.notifications !== false,
            reminders: userData.preferences.reminders !== false
          };
        }
      } catch (err) {
        console.error('获取用户数据失败:', err);
      }
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async updateProfile() {
      try {
        this.profileLoading = true;
        this.profileError = null;
        
        await axios.put('/api/users/profile', this.profile);
        
        this.$toast.success('个人资料已更新');
      } catch (err) {
        this.profileError = err.response?.data?.msg || '更新个人资料失败，请稍后再试';
        console.error('更新个人资料失败:', err);
      } finally {
        this.profileLoading = false;
      }
    },
    async updateGoals() {
      try {
        this.goalsLoading = true;
        this.goalsError = null;
        
        await axios.put('/api/users/goals', this.goals);
        
        this.$toast.success('健康目标已更新');
      } catch (err) {
        this.goalsError = err.response?.data?.msg || '更新健康目标失败，请稍后再试';
        console.error('更新健康目标失败:', err);
      } finally {
        this.goalsLoading = false;
      }
    },
    async updatePassword() {
      try {
        this.passwordLoading = true;
        this.passwordError = null;
        
        // 验证密码
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
          this.passwordError = '两次输入的新密码不一致';
          return;
        }
        
        await axios.put('/api/users/password', {
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        });
        
        // 清空表单
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        this.$toast.success('密码已更新');
      } catch (err) {
        this.passwordError = err.response?.data?.msg || '更新密码失败，请稍后再试';
        console.error('更新密码失败:', err);
      } finally {
        this.passwordLoading = false;
      }
    },
    async updatePreferences() {
      try {
        this.preferencesLoading = true;
        this.preferencesError = null;
        
        await axios.put('/api/users/preferences', this.preferences);
        
        this.$toast.success('应用设置已更新');
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', this.preferences.theme);
      } catch (err) {
        this.preferencesError = err.response?.data?.msg || '更新应用设置失败，请稍后再试';
        console.error('更新应用设置失败:', err);
      } finally {
        this.preferencesLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.form-check {
  user-select: none;
}
</style>