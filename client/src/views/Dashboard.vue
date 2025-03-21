<template>
  <div>
    <h1 class="mb-4">健康数据仪表盘</h1>
    
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">健康概览</h5>
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
            </div>
            <div v-else>
              <p class="card-text">最新体重: {{ latestWeight ? `${latestWeight} kg` : '暂无数据' }}</p>
              <p class="card-text">最新血压: {{ latestBloodPressure ? `${latestBloodPressure.systolic}/${latestBloodPressure.diastolic} mmHg` : '暂无数据' }}</p>
              <p class="card-text">最新心率: {{ latestHeartRate ? `${latestHeartRate} bpm` : '暂无数据' }}</p>
              <router-link to="/health-data/add" class="btn btn-primary">记录健康数据</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">运动概览</h5>
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
            </div>
            <div v-else>
              <p class="card-text">本周运动次数: {{ weeklyStats.totalSessions || 0 }}</p>
              <p class="card-text">本周运动时长: {{ weeklyStats.totalDuration || 0 }} 分钟</p>
              <p class="card-text">本周消耗热量: {{ weeklyStats.totalCalories || 0 }} 卡路里</p>
              <router-link to="/exercises/add" class="btn btn-primary">记录运动</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">快速操作</h5>
            <div class="d-grid gap-2">
              <router-link to="/health-data" class="btn btn-outline-primary">查看健康数据</router-link>
              <router-link to="/exercises" class="btn btn-outline-primary">查看运动记录</router-link>
              <router-link to="/reports" class="btn btn-outline-primary">查看数据报告</router-link>
              <router-link to="/profile" class="btn btn-outline-primary">个人资料</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">体重趋势</h5>
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
            </div>
            <div v-else-if="weightData.length === 0" class="text-center py-4">
              <p>暂无体重数据</p>
            </div>
            <div v-else ref="weightChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">运动分布</h5>
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
            </div>
            <div v-else-if="Object.keys(typeStats).length === 0" class="text-center py-4">
              <p>暂无运动数据</p>
            </div>
            <div v-else ref="exerciseChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      healthData: [],
      weightData: [],
      latestWeight: null,
      latestBloodPressure: null,
      latestHeartRate: null,
      weeklyStats: {},
      typeStats: {},
      weightChart: null,
      exerciseChart: null
    };
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async mounted() {
    try {
      await this.fetchData();
      this.renderCharts();
    } catch (err) {
      console.error('获取数据失败:', err);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    if (this.weightChart) {
      this.weightChart.dispose();
    }
    if (this.exerciseChart) {
      this.exerciseChart.dispose();
    }
  },
  methods: {
    async fetchData() {
      try {
        // 获取健康数据
        const healthResponse = await axios.get('/api/health-data');
        this.healthData = healthResponse.data;
        
        if (this.healthData.length > 0) {
          const latest = this.healthData[0];
          this.latestWeight = latest.weight;
          this.latestBloodPressure = latest.bloodPressure;
          this.latestHeartRate = latest.heartRate;
        }
        
        // 获取健康数据统计
        const healthStatsResponse = await axios.get('/api/health-data/stats/all');
        this.weightData = healthStatsResponse.data.weightData;
        
        // 获取运动统计
        const exerciseStatsResponse = await axios.get('/api/exercises/stats/all');
        this.weeklyStats = exerciseStatsResponse.data.weeklyStats;
        this.typeStats = exerciseStatsResponse.data.typeStats;
      } catch (err) {
        console.error('获取数据失败:', err);
      }
    },
    renderCharts() {
      // 渲染体重趋势图
      if (this.weightData.length > 0 && this.$refs.weightChart) {
        this.weightChart = am4core.create(this.$refs.weightChart, am4charts.XYChart);
        this.weightChart.data = this.weightData;
        
        // 创建坐标轴
        let dateAxis = this.weightChart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        
        let valueAxis = this.weightChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "体重 (kg)";
        
        // 创建系列
        let series = this.weightChart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.stroke = am4core.color("#5C6BC0");
        series.fill = am4core.color("#5C6BC0");
        series.fillOpacity = 0.2;
        
        // 添加子弹点
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = am4core.color("#5C6BC0");
        bullet.circle.strokeWidth = 2;
        bullet.circle.fill = am4core.color("#ffffff");
        
        // 添加光标
        this.weightChart.cursor = new am4charts.XYCursor();
      }
      
      // 渲染运动分布图
      if (Object.keys(this.typeStats).length > 0 && this.$refs.exerciseChart) {
        this.exerciseChart = am4core.create(this.$refs.exerciseChart, am4charts.PieChart);
        
        // 转换数据格式
        const chartData = Object.entries(this.typeStats).map(([type, stats]) => ({
          type: this.translateExerciseType(type),
          count: stats.count
        }));
        
        this.exerciseChart.data = chartData;
        
        // 创建系列
        let pieSeries = this.exerciseChart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "type";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        
        // 添加标签
        pieSeries.labels.template.text = "{category}: {value}";
        pieSeries.ticks.template.disabled = false;
        
        // 添加图例
        this.exerciseChart.legend = new am4charts.Legend();
      }
    },
    translateExerciseType(type) {
      const translations = {
        'running': '跑步',
        'walking': '步行',
        'cycling': '骑行',
        'swimming': '游泳',
        'weightlifting': '举重',
        'yoga': '瑜伽',
        'other': '其他'
      };
      return translations[type] || type;
    }
  }
}
</script>
<style scoped>
/* 可以添加组件特定的样式 */
</style>
