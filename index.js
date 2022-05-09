const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors());
app.options("*", cors(corsConfig));
app.use(express.json());

const validateId = (req, res, next) => {
  const id = req.params.id;
  const objectIdRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  const validId = objectIdRegex.test(id);

  if (!id || !validId) {
    return res.send({ success: false, error: "Invalid id" });
  }

  req.id = id;

  next();
};

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
    const productCollection = client.db("barakah").collection("products");
    // console.log('DB connected');
    // post data to DB
    app.post("/products", async (req, res) => {
      const product = req.body;
      if (
        !product.name ||
        !product.price ||
        !product.img ||
        !product.desc ||
        !product.quantity ||
        !product.dealer
      ) {
        return res.send({
          success: false,
          error: "Please provide all information",
        });
      }
      await productCollection.insertOne(product);
      // res.json({ product });
      res.send({
        success: true,
        message: `Successfully inserted ${product.name}`,
      });
    });
    // get limit products
    app.get("/products", async (req, res) => {
      const limit = Number(req.query.limit);
      // console.log(limit);
      const cursor = productCollection.find();
      const products = await cursor.limit(limit).toArray();
      // console.log(products);
      if (!products?.length) {
        return res.send({ success: false, error: "No product found" });
      }
      res.send({
        success: true,
        data: products,
      });
    });
    // get all products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      if (!products?.length) {
        return res.send({ success: false, error: "No product found" });
      }
      res.send({
        success: true,
        data: products,
      });
    });

    //get products with pagination

    app.get("/products", async (req, res) => {
      const limit = Number(req.query.limit);
      const pageNumber = Number(req.query.pageNumber);

      const cursor = productCollection.find();
      const products = await cursor
        .skip(limit * pageNumber)
        .limit(limit)
        .toArray();

      const count = await productCollection.estimatedDocumentCount();

      if (!products?.length) {
        return res.send({ success: false, error: "No product found" });
      }

      res.send({ success: true, data: products, count: count });
    });

    //get with id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      // res.send(result);
      res.send({
        success: true,
        data: products,
      });
    });
    // update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          ...data,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // delete
    app.delete("/products/:id", validateId, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      if (!result.deletedCount) {
        return res.send({ success: false, error: "something went wrong" });
      }

      // res.send(result);
      res.send({
        success: true,
        message: `Successfully deleted`,
      });
    });
  } catch (error) {
    console.log(error);
  }
})();

// testing api
app.get("/json", (req, res) => {
  res.send({ message: "Barakah stocks running" });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
