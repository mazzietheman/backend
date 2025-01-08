const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.loginSeller = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    res.status(200).json({ status: 'success', userId: user._id });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};