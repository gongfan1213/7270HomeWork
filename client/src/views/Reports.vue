<template>
  <div>
    <h1 class="mb-4">健康数据报告</h1>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">报告类型</h5>
            <select class="form-select" v-model="selectedReport">
              <option value="weight">体重趋势</option>
              <option value="bloodPressure">血压趋势</option>
              <option value="heartRate">心率趋势</option>
              <option value="exercise">运动统计</option>
              <option value="sleep">睡眠统计</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">时间范围</h5>
            <select class="form-select" v-model="timeRange">
              <option value="7">最近一周</option>
              <option value="30">最近一个月</option>
              <option value="90">最近三个月</option>
              <option value="180">最近六个月</option>
              <option value="365">最近一年</option>
              <option value="custom">自定义范围</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="col-md-4" v-if="timeRange === 'custom'">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">自定义日期范围</h5>
            <div class="row">
              <div class="col-6">
                <label class="form-label">开始日期</label>
                <input type="date" class="form-control" v-model="customDateFrom">
              </div>
              <div class="col-6">
                <label class="form-label">结束日期</label>
                <input type="date" class="form-control" v-model="customDateTo">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card mb-4">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        
        <div v-else-if="noData" class="text-center py-5">
          <p class="mb-0">所选时间范围内没有数据</p>
        </div>
        
        <div v-else>
          <!-- 体重趋势图 -->
          <div v-if="selectedReport === 'weight'" class="chart-container">
            <h4 class="text-center mb-4">体重趋势</h4>
            <div ref="weightChart" style="height: 400px;"></div>
          </div>
          
          <!-- 血压趋势图 -->
          <div v-if="selectedReport === 'bloodPressure'" class="chart-container">
            <h4 class="text-center mb-4">血压趋势</h4>
            <div ref="bloodPressureChart" style="height: 400px;"></div>
          </div>
          
          <!-- 心率趋势图 -->
          <div v-if="selectedReport === 'heartRate'" class="chart-container">
            <h4 class="text-center mb-4">心率趋势</h4>
            <div ref="heartRateChart" style="height: 400px;"></div>
          </div>
          
          <!-- 运动统计图 -->
          <div v-if="selectedReport === 'exercise'" class="chart-container">
            <h4 class="text-center mb-4">运动统计</h4>
            <div class="row">
              <div class="col-md-6">
                <div ref="exerciseTypeChart" style="height: 300px;"></div>
              </div>
              <div class="col-md-6">
                <div ref="exerciseDurationChart" style="height: 300px;"></div>
              </div>
            </div>
          </div>
          
          <!-- 睡眠统计图 -->
          <div v-if="selectedReport === 'sleep'" class="chart-container">
            <h4 class="text-center mb-4">睡眠统计</h4>
            <div ref="sleepChart" style="height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">数据分析</h5>
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        <div v-else-if="noData" class="text-center py-3">
          <p class="mb-0">所选时间范围内没有数据</p>
        </div>
        <div v-else>
          <div v-if="selectedReport === 'weight'">
            <p><strong>平均体重:</strong> {{ weightStats.average.toFixed(1) }} kg</p>
            <p><strong>最低体重:</strong> {{ weightStats.min.toFixed(1) }} kg</p>
            <p><strong>最高体重:</strong> {{ weightStats.max.toFixed(1) }} kg</p>
            <p><strong>体重变化:</strong> {{ weightStats.change > 0 ? '+' : '' }}{{ weightStats.change.toFixed(1) }} kg</p>
          </div>
          
          <div v-if="selectedReport === 'bloodPressure'">
            <p><strong>平均收缩压:</strong> {{ bloodPressureStats.avgSystolic.toFixed(0) }} mmHg</p>
            <p><strong>平均舒张压:</strong> {{ bloodPressureStats.avgDiastolic.toFixed(0) }} mmHg</p>
            <p><strong>最高收缩压:</strong> {{ bloodPressureStats.maxSystolic }} mmHg</p>
            <p><strong>最高舒张压:</strong> {{ bloodPressureStats.maxDiastolic }} mmHg</p>
          </div>
          
          <div v-if="selectedReport === 'heartRate'">
            <p><strong>平均心率:</strong> {{ heartRateStats.average.toFixed(0) }} bpm</p>
            <p><strong>最低心率:</strong> {{ heartRateStats.min }} bpm</p>
            <p><strong>最高心率:</strong> {{ heartRateStats.max }} bpm</p>
          </div>
          
          <div v-if="selectedReport === 'exercise'">
            <p><strong>总运动次数:</strong> {{ exerciseStats.totalSessions }}</p>
            <p><strong>总运动时长:</strong> {{ exerciseStats.totalDuration }} 分钟</p>
            <p><strong>总消耗热量:</strong> {{ exerciseStats.totalCalories }} 卡路里</p>
            <p><strong>最常进行的运动:</strong> {{ translateExerciseType(exerciseStats.mostFrequentType) }}</p>
          </div>
          
          <div v-if="selectedReport === 'sleep'">
            <p><strong>平均睡眠时间:</strong> {{ sleepStats.average.toFixed(1) }} 小时</p>
            <p><strong>最短睡眠时间:</strong> {{ sleepStats.min }} 小时</p>
            <p><strong>最长睡眠时间:</strong> {{ sleepStats.max }} 小时</p>
            <p><strong>推荐睡眠时间:</strong> 7-9 小时</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

export default {
  name: 'Reports',
  data() {
    return {
      selectedReport: 'weight',
      timeRange: '30',
      customDateFrom: '',
      customDateTo: '',
      loading: true,
      healthData: [],
      exercises: [],
      charts: {},
      noData: false,
      
      // 统计数据
      weightStats: {
        average: 0,
        min: 0,
        max: 0,
        change: 0
      },
      bloodPressureStats: {
        avgSystolic: 0,
        avgDiastolic: 0,
        maxSystolic: 0,
        maxDiastolic: 0
      },
      heartRateStats: {
        average: 0,
        min: 0,
        max: 0
      },
      exerciseStats: {
        totalSessions: 0,
        totalDuration: 0,
        totalCalories: 0,
        mostFrequentType: ''
      },
      sleepStats: {
        average: 0,
        min: 0,
        max: 0
      }
    };
  },
  watch: {
    selectedReport() {
      this.disposeCharts();
      this.processData();
      this.$nextTick(() => {
        this.renderCharts();
      });
    },
    timeRange() {
      this.fetchData();
    },
    customDateFrom() {
      if (this.timeRange === 'custom') {
        this.fetchData();
      }
    },
    customDateTo() {
      if (this.timeRange === 'custom') {
        this.fetchData();
      }
    }
  },
  async mounted() {
    // 设置默认的自定义日期范围
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.customDateFrom = this.formatDateForInput(thirtyDaysAgo);
    this.customDateTo = this.formatDateForInput(today);
    
    await this.fetchData();
  },
  beforeUnmount() {
    this.disposeCharts();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        
        // 获取健康数据
        const healthResponse = await axios.get('/api/health-data');
        this.healthData = healthResponse.data;
        
        // 获取运动记录
        const exerciseResponse = await axios.get('/api/exercises');
        this.exercises = exerciseResponse.data;
        
        this.processData();
        this.$nextTick(() => {
          this.renderCharts();
        });
      } catch (err) {
        console.error('获取数据失败:', err);
      } finally {
        this.loading = false;
      }
    },
    processData() {
      // 根据时间范围过滤数据
      const filteredHealthData = this.filterDataByTimeRange(this.healthData);
      const filteredExercises = this.filterDataByTimeRange(this.exercises);
      
      this.noData = filteredHealthData.length === 0 && filteredExercises.length === 0;
      
      if (this.noData) return;
      
      // 处理体重数据
      if (this.selectedReport === 'weight') {
        const weightData = filteredHealthData.filter(item => item.weight);
        if (weightData.length > 0) {
          this.weightStats.average = weightData.reduce((sum, item) => sum + item.weight, 0) / weightData.length;
          this.weightStats.min = Math.min(...weightData.map(item => item.weight));
          this.weightStats.max = Math.max(...weightData.map(item => item.weight));
          
          // 计算体重变化
          const oldestWeight = weightData[weightData.length - 1].weight;
          const newestWeight = weightData[0].weight;
          this.weightStats.change = newestWeight - oldestWeight;
        }
      }
      
      // 处理血压数据
      if (this.selectedReport === 'bloodPressure') {
        const bpData = filteredHealthData.filter(item => item.bloodPressure && item.bloodPressure.systolic && item.bloodPressure.diastolic);
        if (bpData.length > 0) {
          this.bloodPressureStats.avgSystolic = bpData.reduce((sum, item) => sum + item.bloodPressure.systolic, 0) / bpData.length;
          this.bloodPressureStats.avgDiastolic = bpData.reduce((sum, item) => sum + item.bloodPressure.diastolic, 0) / bpData.length;
          this.bloodPressureStats.maxSystolic = Math.max(...bpData.map(item => item.bloodPressure.systolic));
          this.bloodPressureStats.maxDiastolic = Math.max(...bpData.map(item => item.bloodPressure.diastolic));
        }
      }
      
      // 处理心率数据
      if (this.selectedReport === 'heartRate') {
        const hrData = filteredHealthData.filter(item => item.heartRate);
        if (hrData.length > 0) {
          this.heartRateStats.average = hrData.reduce((sum, item) => sum + item.heartRate, 0) / hrData.length;
          this.heartRateStats.min = Math.min(...hrData.map(item => item.heartRate));
          this.heartRateStats.max = Math.max(...hrData.map(item => item.heartRate));
        }
      }
      
      // 处理运动数据
      if (this.selectedReport === 'exercise') {
        if (filteredExercises.length > 0) {
          this.exerciseStats.totalSessions = filteredExercises.length;
          this.exerciseStats.totalDuration = filteredExercises.reduce((sum, item) => sum + item.duration, 0);
          this.exerciseStats.totalCalories = filteredExercises.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
          
          // 计算最常进行的运动类型
          const typeCounts = {};
          filteredExercises.forEach(item => {
            typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
          });
          
          let maxCount = 0;
          let mostFrequentType = '';
          
          Object.entries(typeCounts).forEach(([type, count]) => {
            if (count > maxCount) {
              maxCount = count;
              mostFrequentType = type;
            }
          });
          
          this.exerciseStats.mostFrequentType = mostFrequentType;
        }
      }
      
      // 处理睡眠数据
      if (this.selectedReport === 'sleep') {
        const sleepData = filteredHealthData.filter(item => item.sleepHours);
        if (sleepData.length > 0) {
          this.sleepStats.average = sleepData.reduce((sum, item) => sum + item.sleepHours, 0) / sleepData.length;
          this.sleepStats.min = Math.min(...sleepData.map(item => item.sleepHours));
          this.sleepStats.max = Math.max(...sleepData.map(item => item.sleepHours));
        }
      }
    },
    filterDataByTimeRange(data) {
      if (!data || data.length === 0) return [];
      
      const today = new Date();
      let fromDate;
      
      if (this.timeRange === 'custom') {
        if (!this.customDateFrom || !this.customDateTo) return data;
        
        fromDate = new Date(this.customDateFrom);
        const toDate = new Date(this.customDateTo);
        toDate.setHours(23, 59, 59, 999); // 设置为当天结束
        
        return data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDate && itemDate <= toDate;
        });
      } else {
        const days = parseInt(this.timeRange);
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - days);
        
        return data.filter(item => new Date(item.date) >= fromDate);
      }
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    renderCharts() {
      if (this.noData) return;
      
      // 渲染体重趋势图
      if (this.selectedReport === 'weight' && this.$refs.weightChart) {
        const filteredData = this.filterDataByTimeRange(this.healthData)
          .filter(item => item.weight)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(item => ({
            date: new Date(item.date),
            value: item.weight
          }));
        
        if (filteredData.length > 0) {
          const chart = am4core.create(this.$refs.weightChart, am4charts.XYChart);
          chart.data = filteredData;
          
          // 创建坐标轴
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minGridDistance = 50;
          
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.title.text = "体重 (kg)";
          
          // 创建系列
          let series = chart.series.push(new am4charts.LineSeries());
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
          chart.cursor = new am4charts.XYCursor();
          
          this.charts.weightChart = chart;
        }
      }
      
      // 渲染血压趋势图
      if (this.selectedReport === 'bloodPressure' && this.$refs.bloodPressureChart) {
        const filteredData = this.filterDataByTimeRange(this.healthData)
          .filter(item => item.bloodPressure && item.bloodPressure.systolic && item.bloodPressure.diastolic)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(item => ({
            date: new Date(item.date),
            systolic: item.bloodPressure.systolic,
            diastolic: item.bloodPressure.diastolic
          }));
        
        if (filteredData.length > 0) {
          const chart = am4core.create(this.$refs.bloodPressureChart, am4charts.XYChart);
          chart.data = filteredData;
          
          // 创建坐标轴
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minGridDistance = 50;
          
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.title.text = "血压 (mmHg)";
          
          // 创建收缩压系列
          let systolicSeries = chart.series.push(new am4charts.LineSeries());
          systolicSeries.dataFields.valueY = "systolic";
          systolicSeries.dataFields.dateX = "date";
          systolicSeries.strokeWidth = 2;
          systolicSeries.stroke = am4core.color("#F44336");
          systolicSeries.name = "收缩压";
          
          // 添加子弹点
          let systolicBullet = systolicSeries.bullets.push(new am4charts.CircleBullet());
          systolicBullet.circle.stroke = am4core.color("#F44336");
          systolicBullet.circle.strokeWidth = 2;
          systolicBullet.circle.fill = am4core.color("#ffffff");
          
          // 创建舒张压系列
          let diastolicSeries = chart.series.push(new am4charts.LineSeries());
          diastolicSeries.dataFields.valueY = "diastolic";
          diastolicSeries.dataFields.dateX = "date";
          diastolicSeries.strokeWidth = 2;
          diastolicSeries.stroke = am4core.color("#2196F3");
          diastolicSeries.name = "舒张压";
          
          // 添加子弹点
          let diastolicBullet = diastolicSeries.bullets.push(new am4charts.CircleBullet());
          diastolicBullet.circle.stroke = am4core.color("#2196F3");
          diastolicBullet.circle.strokeWidth = 2;
          diastolicBullet.circle.fill = am4core.color("#ffffff");
          
          // 添加图例
          chart.legend = new am4charts.Legend();
          
          // 添加光标
          chart.cursor = new am4charts.XYCursor();
          
          this.charts.bloodPressureChart = chart;
        }
      }
      
      // 渲染心率趋势图
      if (this.selectedReport === 'heartRate' && this.$refs.heartRateChart) {
        const filteredData = this.filterDataByTimeRange(this.healthData)
          .filter(item => item.heartRate)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(item => ({
            date: new Date(item.date),
            value: item.heartRate
          }));
        
        if (filteredData.length > 0) {
          const chart = am4core.create(this.$refs.heartRateChart, am4charts.XYChart);
          chart.data = filteredData;
          
          // 创建坐标轴
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minGridDistance = 50;
          
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.title.text = "心率 (bpm)";
          
          // 创建系列
          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = "value";
          series.dataFields.dateX = "date";
          series.strokeWidth = 2;
          series.stroke = am4core.color("#FF5722");
          series.fill = am4core.color("#FF5722");
          series.fillOpacity = 0.2;
          
          // 添加子弹点
          let bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = am4core.color("#FF5722");
          bullet.circle.strokeWidth = 2;
          bullet.circle.fill = am4core.color("#ffffff");
          
          // 添加光标
          chart.cursor = new am4charts.XYCursor();
          
          this.charts.heartRateChart = chart;
        }
      }
      
      // 渲染运动统计图
      if (this.selectedReport === 'exercise') {
        const filteredData = this.filterDataByTimeRange(this.exercises);
        
        if (filteredData.length > 0) {
          // 运动类型饼图
          if (this.$refs.exerciseTypeChart) {
            // 按类型分组
            const typeData = {};
            filteredData.forEach(item => {
              typeData[item.type] = (typeData[item.type] || 0) + 1;
            });
            
            // 转换为图表数据
            const chartData = Object.entries(typeData).map(([type, count]) => ({
              type: this.translateExerciseType(type),
              count: count
            }));
            
            const chart = am4core.create(this.$refs.exerciseTypeChart, am4charts.PieChart);
            chart.data = chartData;
            
            // 创建系列
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "count";
            pieSeries.dataFields.category = "type";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;
            
            // 添加标签
            pieSeries.labels.template.text = "{category}: {value}";
            pieSeries.ticks.template.disabled = false;
            
            // 添加图例
            chart.legend = new am4charts.Legend();
            chart.legend.position = "right";
            
            this.charts.exerciseTypeChart = chart;
          }
          
          // 运动时长柱状图
          if (this.$refs.exerciseDurationChart) {
            // 按日期分组
            const durationData = {};
            filteredData.forEach(item => {
              const date = new Date(item.date);
              const dateStr = this.formatDate(date);
              durationData[dateStr] = (durationData[dateStr] || 0) + item.duration;
            });
            
            // 转换为图表数据
            const chartData = Object.entries(durationData)
              .map(([date, duration]) => ({
                date: date,
                duration: duration
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            const chart = am4core.create(this.$refs.exerciseDurationChart, am4charts.XYChart);
            chart.data = chartData;
            
            // 创建坐标轴
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "date";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.labels.template.rotation = 45;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "运动时长 (分钟)";
            
            // 创建系列
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "duration";
            series.dataFields.categoryX = "date";
            series.name = "运动时长";
            series.columns.template.tooltipText = "{categoryX}: {valueY} 分钟";
            series.columns.template.fill = am4core.color("#4CAF50");
            
            // 添加数值标签
            let valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueY}";
            valueLabel.label.verticalCenter = "bottom";
            valueLabel.label.dy = -10;
            
            this.charts.exerciseDurationChart = chart;
          }
        }
      }
      
      // 渲染睡眠统计图
      if (this.selectedReport === 'sleep' && this.$refs.sleepChart) {
        const filteredData = this.filterDataByTimeRange(this.healthData)
          .filter(item => item.sleepHours)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(item => ({
            date: new Date(item.date),
            value: item.sleepHours
          }));
        
        if (filteredData.length > 0) {
          const chart = am4core.create(this.$refs.sleepChart, am4charts.XYChart);
          chart.data = filteredData;
          
          // 创建坐标轴
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minGridDistance = 50;
          
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.title.text = "睡眠时间 (小时)";
          
          // 创建系列
          let series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = "value";
          series.dataFields.dateX = "date";
          series.strokeWidth = 2;
          series.stroke = am4core.color("#673AB7");
          series.fill = am4core.color("#673AB7");
          
          // 添加数值标签
          let valueLabel = series.bullets.push(new am4charts.LabelBullet());
          valueLabel.label.text = "{valueY}";
          valueLabel.label.verticalCenter = "bottom";
          valueLabel.label.dy = -10;
          
          // 添加推荐睡眠时间范围
          let range = valueAxis.axisRanges.create();
          range.value = 7;
          range.endValue = 9;
          range.axisFill.fill = am4core.color("#4CAF50");
          range.axisFill.fillOpacity = 0.2;
          range.label.text = "推荐睡眠时间";
          
          // 添加光标
          chart.cursor = new am4charts.XYCursor();
          
          this.charts.sleepChart = chart;
        }
      }
    },
    disposeCharts() {
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.dispose();
        }
      });
      this.charts = {};
    },
    formatDate(date) {
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

.chart-container {
  padding: 1rem;
}
</style>