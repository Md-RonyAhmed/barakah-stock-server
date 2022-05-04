const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// DB connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@barakah.z3u4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

(async () => {
   try {
      await client.connect();
      const productCollection = client.db('barakah').collection('products');
      // console.log('DB connected');
      // post data to DB 
      app.post('/products', async(req, res) => {
         const product = req.body;
         await productCollection.insertOne(product);
         // res.json({ product });
         res.send({ success: true, message: `Successfully inserted ${product.name}` });
      })
      // get all products 
      app.get('/products', async(req, res) => {
         const query = {};
         const cursor = productCollection.find(query);
         const products = await cursor.toArray();
         res.send(products);
      })
      // delete 
      app.delete('/products/:id', async(req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await productCollection.deleteOne(query);
         // res.send(result);
         res.send({
           success: true,
           message: `Successfully deleted`,
         });
      })
   } catch (error) {
      console.log(error);
   }
})();



// testing api 
app.get("/json", (req, res) => {
   res.send({ message: "Barakah stocks running"});
});

app.listen(port, () => {
   console.log(`Server running on port: ${port}`)
});