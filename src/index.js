var mongoose = require("mongoose");
var express= require("express");
var app = express();
var bodyParser = require("body-parser");
const config= require('config');
var cookieParser = require('cookie-parser');
const cors= require('cors');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

mongoose.connect(config.get('db'),{useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> console.log(`Connected to ${config.get('db')}...`))
    .catch(err => console.log(`Could not connect to ${config.get('db')}...`,err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use('/product',productRoutes);
app.use('/cart',cartRoutes);
app.use('/user',userRoutes);

require('./prod.js')(app);

app.set("view engine", "ejs");

app.get('/',async function(req,res){
    res.send('Welcome');
});

const port=process.env.PORT || 8000;
console.log(port);
const server=app.listen(port, ()=> console.log(`Listening on port ${port}...`));
var env = process.env.NODE_ENV || 'development';
console.log(env);
module.exports= server;