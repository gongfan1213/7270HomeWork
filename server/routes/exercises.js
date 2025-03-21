const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middleware/auth');

// @route   GET api/exercises
// @desc    获取所有运动记录
// @access  Private
router.get('/', auth, exerciseController.getAllExercises);

// @route   GET api/exercises/:id
// @desc    获取单条运动记录
// @access  Private
router.get('/:id', auth, exerciseController.getExerciseById);

// @route   POST api/exercises
// @desc    创建运动记录
// @access  Private
router.post('/', auth, exerciseController.createExercise);

// @route   PUT api/exercises/:id
// @desc    更新运动记录
// @access  Private
router.put('/:id', auth, exerciseController.updateExercise);

// @route   DELETE api/exercises/:id
// @desc    删除运动记录
// @access  Private
router.delete('/:id', auth, exerciseController.deleteExercise);

// @route   GET api/exercises/stats/all
// @desc    获取运动统计
// @access  Private
router.get('/stats/all', auth, exerciseController.getExerciseStats);

// @route   GET api/exercises/user-data
// @desc    获取用户和运动记录的关联数据
// @access  Private
router.get('/user-data', auth, exerciseController.getUserExerciseData);

module.exports = router;