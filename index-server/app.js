const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();

app.use('/static', express.static(__dirname + '/public'));

// Load Users Route
const users = require('./routes/api/users');

// Load Profile Route
const profile = require('./routes/api/profile');

// Load Posts Router
const posts = require('./routes/api/posts');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

app.get('/', (req, res) => {
    res.send({msg: 'Hello everyonee'});
});

app.use('/api/users', users);
app.use('/api/profiles', profile);
app.use('/api/posts', posts);

app.use('/api/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument, { explorer: true, securityDefinitions: 'JWT' }));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Index-server is listening on port ${port}`));