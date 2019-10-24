const express = require('express');

const app = express();

//creating one end point sending data to browser
app.get('/', (req, res) => res.send('API working'))

//look for env variable called PORT, when deploying that's where it's going to get the port num, defaults to 500 if no env variable is set
const PORT = process.env.PORT || 5000

//callback if we want something to happen when it connects
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));