const express = require('express');
const app     = express();

const routes = require('./routes');
app.use('/', routes);
// app.set('view engine', 'ejs');
app.use(express.static('public'));



const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('The server has started on port', port);
});
