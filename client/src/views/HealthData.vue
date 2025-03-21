<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>健康数据管理</h1>
      <router-link to="/health-data/add" class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i> 添加健康数据
      </router-link>
    </div>
    
    <div class="card mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">搜索</span>
              <input type="text" class="form-control" v-model="searchTerm" placeholder="按备注搜索...">
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">日期</span>
              <input type="date" class="form-control" v-model="dateFilter">
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        
        <div v-else-if="filteredHealthData.length === 0" class="text-center py-5">
          <p class="mb-0">暂无健康数据</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  日期 <i :class="getSortIcon('date')"></i>
                </th>
                <th @click="sortBy('weight')" class="sortable">
                  体重 (kg) <i :class="getSortIcon('weight')"></i>
                </th>
                <th>血压 (mmHg)</th>
                <th @click="sortBy('heartRate')" class="sortable">
                  心率 (bpm) <i :class="getSortIcon('heartRate')"></i>
                </th>
                <th @click="sortBy('sleepHours')" class="sortable">
                  睡眠 (小时) <i :class="getSortIcon('sleepHours')"></i>
                </th>
                <th>心情</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedHealthData" :key="item._id">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.weight || '-' }}</td>
                <td>
                  {{ item.bloodPressure ? `${item.bloodPressure.systolic}/${item.bloodPressure.diastolic}` : '-' }}
                </td>
                <td>{{ item.heartRate || '-' }}</td>
                <td>{{ item.sleepHours || '-' }}</td>
                <td>{{ translateMood(item.mood) || '-' }}</td>
                <td>{{ item.notes || '-' }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link :to="`/health-data/edit/${item._id}`" class="btn btn-outline-primary">
                      <i class="bi bi-pencil"></i>
                    </router-link>
                    <button @click="confirmDelete(item._id)" class="btn btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <nav v-if="totalPages > 1" aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">上一页</a>
            </li>
            <li v-for="page in pageNumbers" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">下一页</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    
    <!-- 删除确认模态框 -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">确认删除</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            确定要删除这条健康数据吗？此操作无法撤销。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteHealthData">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'HealthData',
  data() {
    return {
      healthData: [],
      loading: true,
      searchTerm: '',
      dateFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'date',
      sortDir: 'desc',
      deleteId: null,
      deleteModal: null
    };
  },
  computed: {
    filteredHealthData() {
      let filtered = [...this.healthData];
      
      // 搜索过滤
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          (item.notes && item.notes.toLowerCase().includes(term))
        );
      }
      
      // 日期过滤
      if (this.dateFilter) {
        const filterDate = new Date(this.dateFilter);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getFullYear() === filterDate.getFullYear() &&
                 itemDate.getMonth() === filterDate.getMonth() &&
                 itemDate.getDate() === filterDate.getDate();
        });
      }
      
      // 排序
      filtered.sort((a, b) => {
        let aValue = a[this.sortKey];
        let bValue = b[this.sortKey];
        
        // 特殊处理日期
        if (this.sortKey === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // 处理可能的空值
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        if (aValue < bValue) return this.sortDir === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
      
      return filtered;
    },
    paginatedHealthData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredHealthData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredHealthData.length / this.itemsPerPage);
    },
    pageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  async mounted() {
    try {
      await this.fetchHealthData();
      this.deleteModal = new Modal(document.getElementById('deleteModal'));
    } catch (err) {
      console.error('获取健康数据失败:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchHealthData() {
      const response = await axios.get('/api/health-data');
      this.healthData = response.data;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },
    translateMood(mood) {
      const moods = {
        'excellent': '极好',
        'good': '良好',
        'neutral': '一般',
        'bad': '不佳',
        'terrible': '糟糕'
      };
      return moods[mood] || mood;
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortDir = 'asc';
      }
    },
    getSortIcon(key) {
      if (this.sortKey !== key) return 'bi bi-arrow-down-up text-muted';
      return this.sortDir === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    confirmDelete(id) {
      this.deleteId = id;
      this.deleteModal.show();
    },
    async deleteHealthData() {
      try {
        await axios.delete(`/api/health-data/${this.deleteId}`);
        this.healthData = this.healthData.filter(item => item._id !== this.deleteId);
        this.deleteModal.hide();
      } catch (err) {
        console.error('删除健康数据失败:', err);
        alert('删除健康数据失败，请稍后再试');
      }
    }
  }
}
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-group .btn {
  transition: all 0.2s;
}

.btn-group .btn:hover {
  transform: translateY(-2px);
}
</style>