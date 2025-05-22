const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({
    name: 'Админ',
    username: 'admin',
    email: 'admin@example.com', // ✅ email талбар нэмэгдлээ
    password: '1234',
    role: 'admin'
  });
  console.log('✅ Админ хэрэглэгч амжилттай нэмэгдлээ');
  process.exit();
}).catch(err => {
  console.error('❌ Алдаа:', err);
});
