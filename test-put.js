const http = require('http');

const data = JSON.stringify({ status: 'Pronto' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/reserva/43/status',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Resposta:', body));
});

req.on('error', error => console.error('Erro:', error));
req.write(data);
req.end();
