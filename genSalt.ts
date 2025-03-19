// All chars for randomizer
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generate a random salt
let salt = '';
for (let i = 0; i < 32; i++) {
  salt += chars.charAt(Math.floor(Math.random() * chars.length));
}
salt = Buffer.from(salt).toString('base64');

// Generates 32 byte salt
console.log('New *receiving* server salt:')

Buffer.from("Hello World").toString('base64')
console.log(salt);