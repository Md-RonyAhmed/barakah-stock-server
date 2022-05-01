const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

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
      console.log('DB connected');
   } catch (error) {
      console.log(error);
   }
})();

// middleware
app.use(cors());






// testing api 
app.get("/json", (req, res) => {
   res.send({ message: "Barakah stock running"});
});

app.listen(port, () => {
   console.log(`Server running on port: ${port}`)
});