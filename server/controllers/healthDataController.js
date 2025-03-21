const HealthData = require('../models/HealthData');

// 获取用户所有健康数据
exports.getAllHealthData = async (req, res) => {
  try {
    const healthData = await HealthData.find({ user: req.user.id }).sort({ date: -1 });
    res.json(healthData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取单条健康数据
exports.getHealthDataById = async (req, res) => {
  try {
    const healthData = await HealthData.findById(req.params.id);
    
    // 检查健康数据是否存在
    if (!healthData) {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    
    // 检查用户是否有权限
    if (healthData.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    res.json(healthData);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    res.status(500).send('服务器错误');
  }
};

// 创建健康数据
exports.createHealthData = async (req, res) => {
  const {
    weight,
    bloodPressure,
    heartRate,
    sleepHours,
    mood,
    notes,
    date
  } = req.body;
  
  try {
    const newHealthData = new HealthData({
      user: req.user.id,
      weight,
      bloodPressure,
      heartRate,
      sleepHours,
      mood,
      notes,
      date: date || Date.now()
    });
    
    const healthData = await newHealthData.save();
    res.json(healthData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更新健康数据
exports.updateHealthData = async (req, res) => {
  const {
    weight,
    bloodPressure,
    heartRate,
    sleepHours,
    mood,
    notes,
    date
  } = req.body;
  
  // 构建健康数据对象
  const healthDataFields = {};
  if (weight) healthDataFields.weight = weight;
  if (bloodPressure) healthDataFields.bloodPressure = bloodPressure;
  if (heartRate) healthDataFields.heartRate = heartRate;
  if (sleepHours) healthDataFields.sleepHours = sleepHours;
  if (mood) healthDataFields.mood = mood;
  if (notes) healthDataFields.notes = notes;
  if (date) healthDataFields.date = date;
  
  try {
    let healthData = await HealthData.findById(req.params.id);
    
    // 检查健康数据是否存在
    if (!healthData) {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    
    // 检查用户是否有权限
    if (healthData.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    // 更新
    healthData = await HealthData.findByIdAndUpdate(
      req.params.id,
      { $set: healthDataFields },
      { new: true }
    );
    
    res.json(healthData);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    res.status(500).send('服务器错误');
  }
};

// 删除健康数据
exports.deleteHealthData = async (req, res) => {
  try {
    const healthData = await HealthData.findById(req.params.id);
    
    // 检查健康数据是否存在
    if (!healthData) {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    
    // 检查用户是否有权限
    if (healthData.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: '用户未授权' });
    }
    
    await healthData.remove();
    
    res.json({ msg: '健康数据已删除' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: '未找到健康数据' });
    }
    res.status(500).send('服务器错误');
  }
};

// 获取健康数据统计
exports.getHealthStats = async (req, res) => {
  try {
    const healthData = await HealthData.find({ user: req.user.id }).sort({ date: 1 });
    
    // 处理数据以便于前端可视化
    const weightData = healthData.map(data => ({
      date: data.date,
      value: data.weight
    }));
    
    const bloodPressureData = healthData.map(data => ({
      date: data.date,
      systolic: data.bloodPressure?.systolic,
      diastolic: data.bloodPressure?.diastolic
    }));
    
    const heartRateData = healthData.map(data => ({
      date: data.date,
      value: data.heartRate
    }));
    
    res.json({
      weightData,
      bloodPressureData,
      heartRateData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};