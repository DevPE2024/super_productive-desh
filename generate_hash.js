const bcrypt = require('bcrypt');

const password = 'password123';

bcrypt.hash(password, 10).then(hash => {
  console.log('Generated hash for password123:', hash);
}).catch(err => {
  console.error('Error generating hash:', err);
});