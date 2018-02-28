const crypto = require('crypto');
let hash = crypto.createHash('sha512');

hash.update(JSON.stringify(undefined));
let digest = hash.digest('hex');

console.log(digest);
