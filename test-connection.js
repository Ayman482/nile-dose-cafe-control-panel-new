const dns = require('dns');
const net = require('net');
const { exec } = require('child_process');

// Test DNS resolution
console.log('Testing DNS resolution...');
dns.lookup('cluster0.mongodb.net', (err, address) => {
  console.log('DNS lookup result:', err || address);
});

// Test SRV record
console.log('Testing SRV record...');
dns.resolveSrv('_mongodb._tcp.cluster0.mongodb.net', (err, addresses) => {
  console.log('SRV record result:', err || addresses);
});

// Test port connectivity
console.log('Testing port connectivity...');
const socket = new net.Socket();
socket.setTimeout(5000);
socket.on('connect', () => {
  console.log('Successfully connected to MongoDB port');
  socket.destroy();
});
socket.on('timeout', () => {
  console.log('Connection timeout - port might be blocked');
  socket.destroy();
});
socket.on('error', (err) => {
  console.log('Connection error:', err);
});
socket.connect(27017, 'cluster0.mongodb.net');

// Test with traceroute
console.log('Running traceroute...');
exec('traceroute cluster0.mongodb.net', (err, stdout, stderr) => {
  console.log('Traceroute result:', stdout || err);
});
