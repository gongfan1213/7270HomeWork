<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>运动记录管理</h1>
      <router-link to="/exercises/add" class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i> 添加运动记录
      </router-link>
    </div>
    
    <div class="card mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">搜索</span>
              <input type="text" class="form-control" v-model="searchTerm" placeholder="按类型或备注搜索...">
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">类型</span>
              <select class="form-select" v-model="typeFilter">
                <option value="">所有类型</option>
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
          <div class="col-md-4">
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
        
        <div v-else-if="filteredExercises.length === 0" class="text-center py-5">
          <p class="mb-0">暂无运动记录</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  日期 <i :class="getSortIcon('date')"></i>
                </th>
                <th @click="sortBy('type')" class="sortable">
                  类型 <i :class="getSortIcon('type')"></i>
                </th>
                <th @click="sortBy('duration')" class="sortable">
                  时长 (分钟) <i :class="getSortIcon('duration')"></i>
                </th>
                <th @click="sortBy('distance')" class="sortable">
                  距离 (公里) <i :class="getSortIcon('distance')"></i>
                </th>
                <th @click="sortBy('caloriesBurned')" class="sortable">
                  消耗热量 <i :class="getSortIcon('caloriesBurned')"></i>
                </th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exercise in paginatedExercises" :key="exercise._id">
                <td>{{ formatDate(exercise.date) }}</td>
                <td>{{ translateExerciseType(exercise.type) }}</td>
                <td>{{ exercise.duration }}</td>
                <td>{{ exercise.distance || '-' }}</td>
                <td>{{ exercise.caloriesBurned || '-' }}</td>
                <td>{{ exercise.notes || '-' }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link :to="`/exercises/edit/${exercise._id}`" class="btn btn-outline-primary">
                      <i class="bi bi-pencil"></i>
                    </router-link>
                    <button @click="confirmDelete(exercise._id)" class="btn btn-outline-danger">
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
            确定要删除这条运动记录吗？此操作无法撤销。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteExercise">删除</button>
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
  name: 'Exercises',
  data() {
    return {
      exercises: [],
      loading: true,
      searchTerm: '',
      typeFilter: '',
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
    filteredExercises() {
      let filtered = [...this.exercises];
      
      // 搜索过滤
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          (item.type && item.type.toLowerCase().includes(term)) ||
          (item.notes && item.notes.toLowerCase().includes(term))
        );
      }
      
      // 类型过滤
      if (this.typeFilter) {
        filtered = filtered.filter(item => item.type === this.typeFilter);
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
    paginatedExercises() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredExercises.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredExercises.length / this.itemsPerPage);
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
      await this.fetchExercises();
      this.deleteModal = new Modal(document.getElementById('deleteModal'));
    } catch (err) {
      console.error('获取运动记录失败:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchExercises() {
      const response = await axios.get('/api/exercises');
      this.exercises = response.data;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },
    translateExerciseType(type) {
      const types = {
        'running': '跑步',
        'walking': '步行',
        'cycling': '骑行',
        'swimming': '游泳',
        'weightlifting': '举重',
        'yoga': '瑜伽',
        'other': '其他'
      };
      return types[type] || type;
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
    async deleteExercise() {
      try {
        await axios.delete(`/api/exercises/${this.deleteId}`);
        this.exercises = this.exercises.filter(ex => ex._id !== this.deleteId);
        this.deleteModal.hide();
      } catch (err) {
        console.error('删除运动记录失败:', err);
        alert('删除运动记录失败，请稍后再试');
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
</style>