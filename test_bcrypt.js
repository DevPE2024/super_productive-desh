const bcrypt = require('bcryptjs');

const password = 'test123456';
const hashedPassword = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeshwVBsVgpEXvKt1b9U5PQC6';

console.log('Testing bcrypt comparison...');
console.log('Password:', password);
console.log('Hash:', hashedPassword);

bcrypt.compare(password, hashedPassword).then(result => {
  console.log('Password comparison result:', result);
  
  // Gerar um novo hash para comparação
  bcrypt.hash(password, 12).then(newHash => {
    console.log('New hash generated:', newHash);
    
    bcrypt.compare(password, newHash).then(newResult => {
      console.log('New hash comparison result:', newResult);
    });
  });
}).catch(err => {
  console.error('Error comparing password:', err);
});