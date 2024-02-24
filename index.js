require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqcfxjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
  // await client.connect();
  console.log("📍Database connection established");
  try {
    const db = client.db("Commerce");
    const productsCollection = db.collection("products");
    const favoriteCollection = db.collection("favorite");

    //Add Products
    app.post('/products', async(req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data)
      res.send(result);
    }) 

    //get all products
    app.get('/products', async(req, res) => {
      const result = await productsCollection.find().toArray()
      res.send()
    })
    
    //get products
    app.get("/products", async (req, res) => {
      const name = req.query.category;
      let products = [];
      if (name == "all-news") {
        products = await productsCollection.find({}).toArray();
        return res.send({ status: true, message: "success", data: products });
      }
      products = await productsCollection
        .find({ category: { $regex: name, $options: "i" } })
        .toArray();
      res.send({ status: true, message: "success", data: products });
    });

    //get products by ID
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productsCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, message: "success", data: product });
    });

    //add favorite products
    app.post('/favorite', async(req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data)
      res.send(result);
    }) 

    //get favorite products by id
    app.get("/favorite/:id", async (req, res) => {
      const id = req.params.id;
      const product = await favoriteCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, message: "success", data: product });
    });

    // get all news
    // app.get("/all-news", async (req, res) => {
    //   const allNews = await newsCollection.find({}).toArray();
    //   res.send({ status: true, message: "success", data: allNews });
    // });

    // get specific news
    // app.get("/news/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const news = await newsCollection.findOne({ _id: ObjectId(id) });
    //   res.send({ status: true, message: "success", data: news });
    // });

    // get all categories
    // app.get("/categories", async (req, res) => {
    //   const categories = await categoriesCollection.find({}).toArray();
    //   res.send({ status: true, message: "success", data: categories });
    // });

    // get specific categories
    // app.get("/news", async (req, res) => {
    //   const name = req.query.category;
    //   let newses = [];
    //   if (name == "all-news") {
    //     newses = await newsCollection.find({}).toArray();
    //     return res.send({ status: true, message: "success", data: newses });
    //   }
    //   newses = await newsCollection
    //     .find({ category: { $regex: name, $options: "i" } })
    //     .toArray();
    //   res.send({ status: true, message: "success", data: newses });
    // });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to the Commerce Server!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});