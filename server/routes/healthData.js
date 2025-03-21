const express = require('express');
const router = express.Router();
const healthDataController = require('../controllers/healthDataController');
const auth = require('../middleware/auth');

// @route   GET api/health-data
// @desc    获取所有健康数据
// @access  Private
router.get('/', auth, healthDataController.getAllHealthData);

// @route   GET api/health-data/:id
// @desc    获取单条健康数据
// @access  Private
router.get('/:id', auth, healthDataController.getHealthDataById);

// @route   POST api/health-data
// @desc    创建健康数据
// @access  Private
router.post('/', auth, healthDataController.createHealthData);

// @route   PUT api/health-data/:id
// @desc    更新健康数据
// @access  Private
router.put('/:id', auth, healthDataController.updateHealthData);

// @route   DELETE api/health-data/:id
// @desc    删除健康数据
// @access  Private
router.delete('/:id', auth, healthDataController.deleteHealthData);

// @route   GET api/health-data/stats/all
// @desc    获取健康数据统计
// @access  Private
router.get('/stats/all', auth, healthDataController.getHealthStats);

module.exports = router;