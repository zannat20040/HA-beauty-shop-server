const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.port || 5000
require('dotenv').config()

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
    
    app.get('/', async (req, res) => {
      res.send(results)
    })

    // send new added product to  database
    const productCollection = client.db("AllProduct").collection("AllProductCollection");


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


    await client.connect();

  }
  finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})