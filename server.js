const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

module.exports =app