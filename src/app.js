const express = require('express')
const app = express()
const port = 3001 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const routes = require('./routes/menuRoutes');
 

app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Multer configuration for handling file uploads

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Use the routes
app.use('/api', routes);
  


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})