// Import crypto lib
import crypto from 'crypto';

// Prompt
import readline from 'readline';

// Create a readline interface
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 * @author Gabe Abrams
 * @param question the question to ask the user
 * @returns the text from the user
 */
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(question, (answer: string) => {
      if (!answer || answer.trim().length === 0) {
        console.log('\nValue cannot be empty. Exiting...');
        process.exit(0);
      }

      resolve(answer);
    });
  });
};

// All chars for randomizer
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

(async () => {
  console.log('––––– Generate Encoded Secret –––––');
  console.log('\nFirst, we need info on the *receiving* server');
  console.log('This is the server that hosts the cross-server endpoint, the one that receives requests from the sending server.\n');

  // Get salt
  console.log('Encoding salt on the *receiving* server')
  const salt = await prompt('Salt: ');

  // Get host
  console.log('Hostname of the *receiving* server');
  const host = await prompt('Host: ');

  console.log('\n\nSecond, we need info on the *sending* server');
  console.log('This is the server that sends requests to the receiving server.\n');

  // Get key
  console.log('Short unique key for the *sending* server (only letters and dashes, no whitespace)')
  const key = (await prompt('Key: ')).trim();

  // Get description
  console.log('Human-readable description of the *sending* server')
  const description = await prompt('Description: ');

  // Generate a random secret
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  secret = Buffer.from(secret).toString('base64');

  // Encryption process based on:
  // https://medium.com/@tony.infisical/guide-to-nodes-crypto-module-for-encryption-decryption-65c077176980

  // Create a random initialization vector
  const iv = crypto.randomBytes(12).toString('base64');

  // Create a cipher
  console.log('salt', salt, Buffer.from(salt, 'base64'));
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(salt, 'base64'),
    Buffer.from(iv, 'base64'),
  );

  // Encrypt the string
  let ciphertext = cipher.update(secret, 'utf8', 'base64');

  // Finalize the encryption
  ciphertext += cipher.final('base64');

  // Get the authentication tag
  const tag = cipher.getAuthTag();

  // JSONify the encrypted data
  const encryptionPack = encodeURIComponent(JSON.stringify({
    ciphertext,
    iv,
    tag,
  }));

  // Show the encrypted data
  console.log('\n\n');
  console.log('––––– Done! What\'s Next: –––––');
  console.log('');
  console.log('On the *sending* server, !!APPEND!! the following to the DCEKIT_CROSS_SERVER_CREDENTIALS env var:');
  console.log(`|${host}:${key}:${secret}|`);
  console.log('');
  console.log('On the *receiving* server, add an entry to its "CrossServerCredential" collection:');
  console.log(`{ "description": "${description}", "key": "${key}", "encodedeSecret": "${encryptionPack}", "scopes": [] }`);
  console.log('');
  console.log('For all scopes that the server should have access to, add them to the "scopes" array.');
})();
