<template>
  <div>
    <h1 class="mb-4">{{ isEdit ? '编辑运动记录' : '添加运动记录' }}</h1>
    
    <div class="card">
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="onSubmit">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="date" class="form-label">日期</label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="formData.date"
                required
              />
            </div>
            <div class="col-md-6">
              <label for="type" class="form-label">运动类型</label>
              <select class="form-select" id="type" v-model="formData.type" required>
                <option value="">-- 选择运动类型 --</option>
                <option value="running">跑步</option>
                <option value="walking">步行</option>
                <option value="cycling">骑行</option>
                <option value="swimming">游泳</option>
                <option value="weightlifting">举重</option>
                <option value="yoga">瑜伽</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
          
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="duration" class="form-label">时长 (分钟)</label>
              <input
                type="number"
                class="form-control"
                id="duration"
                v-model="formData.duration"
                min="1"
                required
              />
            </div>
            <div class="col-md-4">
              <label for="distance" class="form-label">距离 (公里)</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="distance"
                v-model="formData.distance"
                placeholder="可选"
              />
            </div>
            <div class="col-md-4">
              <label for="caloriesBurned" class="form-label">消耗热量 (卡路里)</label>
              <input
                type="number"
                class="form-control"
                id="caloriesBurned"
                v-model="formData.caloriesBurned"
                placeholder="可选"
              />
            </div>
          </div>
          
          <div class="mb-3">
            <label for="notes" class="form-label">备注</label>
            <textarea
              class="form-control"
              id="notes"
              rows="3"
              v-model="formData.notes"
              placeholder="添加任何相关的运动笔记..."
            ></textarea>
          </div>
          
          <div class="d-flex justify-content-between">
            <router-link to="/exercises" class="btn btn-secondary">取消</router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '保存中...' : '保存运动记录' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExerciseForm',
  data() {
    return {
      formData: {
        date: this.formatDateForInput(new Date()),
        type: '',
        duration: '',
        distance: '',
        caloriesBurned: '',
        notes: ''
      },
      loading: false,
      error: null
    };
  },
  computed: {
    isEdit() {
      return this.$route.params.id !== undefined;
    }
  },
  async mounted() {
    if (this.isEdit) {
      try {
        this.loading = true;
        await this.fetchExercise();
      } catch (err) {
        this.error = '获取运动记录失败，请稍后再试';
        console.error('获取运动记录失败:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    async fetchExercise() {
      const response = await axios.get(`/api/exercises/${this.$route.params.id}`);
      const data = response.data;
      
      this.formData = {
        date: this.formatDateForInput(new Date(data.date)),
        type: data.type || '',
        duration: data.duration || '',
        distance: data.distance || '',
        caloriesBurned: data.caloriesBurned || '',
        notes: data.notes || ''
      };
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async onSubmit() {
      try {
        this.loading = true;
        this.error = null;
        
        // 准备提交的数据
        const exerciseData = {
          ...this.formData,
          date: new Date(this.formData.date)
        };
        
        // 移除空字段
        Object.keys(exerciseData).forEach(key => {
          if (exerciseData[key] === '' || exerciseData[key] === null) {
            delete exerciseData[key];
          }
        });
        
        if (this.isEdit) {
          // 更新现有运动记录
          await axios.put(`/api/exercises/${this.$route.params.id}`, exerciseData);
        } else {
          // 创建新运动记录
          await axios.post('/api/exercises', exerciseData);
        }
        
        // 重定向到运动记录列表
        this.$router.push('/exercises');
      } catch (err) {
        this.error = err.response?.data?.msg || '保存运动记录失败，请稍后再试';
        console.error('保存运动记录失败:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary, .btn-secondary {
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
}
</style>