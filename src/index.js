var mongoose = require("mongoose");
var express= require("express");
var app = express();
var bodyParser = require("body-parser");
const config= require('config');
var cookieParser = require('cookie-parser');
const cors= require('cors');
const { Product }= require('./models/product');

app.set("view engine", "ejs");
app.set('views', './src/views');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');

mongoose.connect(config.get('db'),{useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> console.log(`Connected to ${config.get('db')}...`))
    .catch(err => console.log(`Could not connect to ${config.get('db')}...`,err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.static("./src/public"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/product',productRoutes);
app.use('/cart',cartRoutes);
app.use('/user',userRoutes);
app.use('/category',categoryRoutes);
app.use('/subcategory',subcategoryRoutes);


app.get('/',async function(req,res){
    const products = await Product.find();
    res.render("index.ejs", { products });
});

const port=process.env.PORT || 8080;
console.log(port);
const server=app.listen(port, ()=> console.log(`Listening on port ${port}...`));
var env = process.env.NODE_ENV || 'development';
console.log(env);
module.exports= server;