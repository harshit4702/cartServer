var mongoose = require("mongoose");
var express= require("express");
var app = express();
var bodyParser = require("body-parser");
const config= require('config');
var cookieParser = require('cookie-parser');
const cors= require('cors');
const {Product}= require('./models/product');

app.set("view engine", "ejs");
app.set('views', './src/views');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

mongoose.connect(config.get('db'),{useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> console.log(`Connected to ${config.get('db')}...`))
    .catch(err => console.log(`Could not connect to ${config.get('db')}...`,err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

app.use('/product',productRoutes);
app.use('/cart',cartRoutes);
app.use('/user',userRoutes);


app.get('/',async function(req,res){
    res.send('Welcome');
});

app.get('/newform' ,(req , res)=>{
    console.log('Hi');
    res.render('product.ejs', {
      link: "/product/create",
      id: null,
      name: "",
      price: "",
      description: "",
      src: [],
      discount: "",
    });
});


app.get('/editform/:id' ,async(req , res)=>{

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Given ID was not found");
  
    const { name, description, price, src, discount } = product;
    res.render("product", {
    link: `/product/edit/${req.params.id}`,
    id: product._id,
    name,
    description,
    price,
    src,
    discount
    });
  });
  
const port=process.env.PORT || 8080;
console.log(port);
const server=app.listen(port, ()=> console.log(`Listening on port ${port}...`));
var env = process.env.NODE_ENV || 'development';
console.log(env);
module.exports= server;