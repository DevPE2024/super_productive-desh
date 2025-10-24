const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/verify-user?email=test@test.com',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    try {
      const json = JSON.parse(data);
      console.log('\n✅ Usuario encontrado:');
      console.log('  ID:', json.id);
      console.log('  Email:', json.email);
      console.log('  Name:', json.name);
      console.log('  Hash (30 chars):', json.hashedPassword ? json.hashedPassword.substring(0, 30) + '...' : 'N/A');
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Erro:', error);
});

req.end();

