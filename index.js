require('dotenv').config();
console.log('Loaded .env configuration');

require("./instrument.js");
console.log('Loaded instrument.js');

const app = require('./app');
console.log('Loaded app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
