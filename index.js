const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o3rqjw9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    //brand name data get and show
    const dataCollection = client.db("BrandShop").collection("BrandCollection");
    const results = await dataCollection.find().toArray();
    const cartCollection = client.db("AddedProduct").collection("AddedCartCollection");
    const productCollection = client.db("AllProduct").collection("AllProductCollection");
    const sliderCollection = client.db("BrandSlider").collection("SliderCollection");

    app.get('/', async (req, res) => {
      res.send(results)
    })

    // send new added product to  database

    app.post('/products', async (req, res) => {
      const newProduct = req.body
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const findProduct = await productCollection.find().toArray();
      res.send(findProduct)
    })

        // get new slider img from  database
        app.get('/slider', async (req, res) => {
          const getSliderImage = await sliderCollection.find().toArray();
          console.log(getSliderImage)
          res.send(getSliderImage)
        })

        // database for add to cart

        app.post('/cart', async (req, res) => {
          const myCart = req.body
          console.log(myCart)
          const existingProduct = await cartCollection.findOne({ _id: myCart._id });

          if(existingProduct){
            res.status(400).json({ message: 'You have already added this product into My Cart' });
          }
          else{
            const result = await cartCollection.insertOne(myCart);
          res.send(result)
          }
          
        })

        app.get('/cart', async (req, res) => {
          const cartProduct = await cartCollection.find().toArray();
          res.send(cartProduct)
        })
        

  }
  finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

