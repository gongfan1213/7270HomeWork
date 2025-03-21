<template>
  <div>
    <h1 class="mb-4">{{ isEdit ? '编辑健康数据' : '添加健康数据' }}</h1>
    
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
              <label for="time" class="form-label">时间</label>
              <input
                type="time"
                class="form-control"
                id="time"
                v-model="formData.time"
                required
              />
            </div>
          </div>
          
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="weight" class="form-label">体重 (kg)</label>
              <input
                type="number"
                step="0.1"
                class="form-control"
                id="weight"
                v-model="formData.weight"
                placeholder="可选"
              />
            </div>
            <div class="col-md-6">
              <label for="heartRate" class="form-label">心率 (bpm)</label>
              <input
                type="number"
                class="form-control"
                id="heartRate"
                v-model="formData.heartRate"
                placeholder="可选"
              />
            </div>
          </div>
          
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">血压 (mmHg)</label>
              <div class="input-group">
                <input
                  type="number"
                  class="form-control"
                  placeholder="收缩压"
                  v-model="formData.systolic"
                />
                <span class="input-group-text">/</span>
                <input
                  type="number"
                  class="form-control"
                  placeholder="舒张压"
                  v-model="formData.diastolic"
                />
              </div>
            </div>
            <div class="col-md-6">
              <label for="sleepHours" class="form-label">睡眠时间 (小时)</label>
              <input
                type="number"
                step="0.5"
                class="form-control"
                id="sleepHours"
                v-model="formData.sleepHours"
                placeholder="可选"
              />
            </div>
          </div>
          
          <div class="mb-3">
            <label for="mood" class="form-label">心情</label>
            <select class="form-select" id="mood" v-model="formData.mood">
              <option value="">-- 选择心情 --</option>
              <option value="excellent">极好</option>
              <option value="good">良好</option>
              <option value="neutral">一般</option>
              <option value="bad">不佳</option>
              <option value="terrible">糟糕</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="notes" class="form-label">备注</label>
            <textarea
              class="form-control"
              id="notes"
              rows="3"
              v-model="formData.notes"
              placeholder="添加任何相关的健康笔记..."
            ></textarea>
          </div>
          
          <div class="d-flex justify-content-between">
            <router-link to="/health-data" class="btn btn-secondary">取消</router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '保存中...' : '保存健康数据' }}
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
  name: 'HealthDataForm',
  data() {
    return {
      formData: {
        date: this.formatDateForInput(new Date()),
        time: this.formatTimeForInput(new Date()),
        weight: '',
        heartRate: '',
        systolic: '',
        diastolic: '',
        sleepHours: '',
        mood: '',
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
        await this.fetchHealthData();
      } catch (err) {
        this.error = '获取健康数据失败，请稍后再试';
        console.error('获取健康数据失败:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    async fetchHealthData() {
      const response = await axios.get(`/api/health-data/${this.$route.params.id}`);
      const data = response.data;
      
      const date = new Date(data.date);
      
      this.formData = {
        date: this.formatDateForInput(date),
        time: this.formatTimeForInput(date),
        weight: data.weight || '',
        heartRate: data.heartRate || '',
        systolic: data.bloodPressure?.systolic || '',
        diastolic: data.bloodPressure?.diastolic || '',
        sleepHours: data.sleepHours || '',
        mood: data.mood || '',
        notes: data.notes || ''
      };
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatTimeForInput(date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    async onSubmit() {
      try {
        this.loading = true;
        this.error = null;
        
        // 准备提交的数据
        const dateTime = new Date(`${this.formData.date}T${this.formData.time}`);
        
        const healthData = {
          date: dateTime,
          weight: this.formData.weight || undefined,
          heartRate: this.formData.heartRate || undefined,
          bloodPressure: (this.formData.systolic && this.formData.diastolic) ? {
            systolic: this.formData.systolic,
            diastolic: this.formData.diastolic
          } : undefined,
          sleepHours: this.formData.sleepHours || undefined,
          mood: this.formData.mood || undefined,
          notes: this.formData.notes || undefined
        };
        
        // 移除空字段
        Object.keys(healthData).forEach(key => {
          if (healthData[key] === undefined) {
            delete healthData[key];
          }
        });
        
        if (this.isEdit) {
          // 更新现有健康数据
          await axios.put(`/api/health-data/${this.$route.params.id}`, healthData);
        } else {
          // 创建新健康数据
          await axios.post('/api/health-data', healthData);
        }
        
        // 重定向到健康数据列表
        this.$router.push('/health-data');
      } catch (err) {
        this.error = err.response?.data?.msg || '保存健康数据失败，请稍后再试';
        console.error('保存健康数据失败:', err);
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

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
</style>