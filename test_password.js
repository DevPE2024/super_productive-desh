const bcrypt = require('bcrypt');

const password = 'password123';
const hashedPassword = '$2b$10$GbKz7QjJsZUx6RwHkZy93eZeA1gDNK01ZshmviOx.AIooClMXCkiq';

bcrypt.compare(password, hashedPassword).then(result => {
  console.log('Password comparison result:', result);
  console.log('Password:', password);
  console.log('Hash:', hashedPassword);
}).catch(err => {
  console.error('Error comparing password:', err);
});