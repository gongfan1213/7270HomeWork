const Exercise = require('../models/Exercise');
const User = require('../models/User');

// 获取用户所有运动记录
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user.id }).sort({ date: -1 });
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取单条运动记录
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    // 检查运动记录是否存在
    if (!exercise) {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    
    // 检查用户是否有权限
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    res.status(500).send('服务器错误');
  }
};

// 创建运动记录
exports.createExercise = async (req, res) => {
  const {
    type,
    duration,
    distance,
    caloriesBurned,
    notes,
    date
  } = req.body;
  
  try {
    const newExercise = new Exercise({
      user: req.user.id,
      type,
      duration,
      distance,
      caloriesBurned,
      notes,
      date: date || Date.now()
    });
    
    const exercise = await newExercise.save();
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更新运动记录
exports.updateExercise = async (req, res) => {
  const {
    type,
    duration,
    distance,
    caloriesBurned,
    notes,
    date
  } = req.body;
  
  // 构建运动记录对象
  const exerciseFields = {};
  if (type) exerciseFields.type = type;
  if (duration) exerciseFields.duration = duration;
  if (distance !== undefined) exerciseFields.distance = distance;
  if (caloriesBurned !== undefined) exerciseFields.caloriesBurned = caloriesBurned;
  if (notes) exerciseFields.notes = notes;
  if (date) exerciseFields.date = date;
  
  try {
    let exercise = await Exercise.findById(req.params.id);
    
    // 检查运动记录是否存在
    if (!exercise) {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    
    // 检查用户是否有权限
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    // 更新
    exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { $set: exerciseFields },
      { new: true }
    );
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    res.status(500).send('服务器错误');
  }
};

// 删除运动记录
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    // 检查运动记录是否存在
    if (!exercise) {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    
    // 检查用户是否有权限
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    await Exercise.findByIdAndDelete(req.params.id);
    
    res.json({ msg: '运动记录已删除' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到运动记录' });
    }
    res.status(500).send('服务器错误');
  }
};

// 获取运动统计
exports.getExerciseStats = async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user.id });
    
    // 按类型分组统计
    const typeStats = {};
    exercises.forEach(exercise => {
      if (!typeStats[exercise.type]) {
        typeStats[exercise.type] = {
          count: 0,
          totalDuration: 0,
          totalCalories: 0
        };
      }
      
      typeStats[exercise.type].count += 1;
      typeStats[exercise.type].totalDuration += exercise.duration;
      typeStats[exercise.type].totalCalories += exercise.caloriesBurned || 0;
    });
    
    // 按周统计
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyExercises = exercises.filter(exercise => 
      new Date(exercise.date) >= oneWeekAgo
    );
    
    const weeklyStats = {
      totalSessions: weeklyExercises.length,
      totalDuration: weeklyExercises.reduce((sum, ex) => sum + ex.duration, 0),
      totalCalories: weeklyExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0)
    };
    
    res.json({
      typeStats,
      weeklyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取用户和运动记录的关联数据
exports.getUserExerciseData = async (req, res) => {
  try {
    // 使用MongoDB的聚合查询
    const userExerciseData = await Exercise.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      { $project: {
          _id: 1,
          type: 1,
          duration: 1,
          date: 1,
          caloriesBurned: 1,
          username: '$userData.username',
          userProfile: '$userData.profile'
        }
      }
    ]);
    
    res.json(userExerciseData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};