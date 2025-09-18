import express from "express";
import fs from "fs";
import methodOverride from "method-override";
const app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(express.json()); // to parse json data
app.set("view engine", "ejs");
app.set("views", "./views");

const readData = () => {
  const data = fs.readFileSync("data.json", "utf-8");
  return JSON.parse(data);
};
const writeData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

app.get("/products", (req, res) => {
  const products = readData();
  res.render("products", { title: "Product List", products });
});

app.get("/products/:id", (req, res) => {
  const products = readData();
  const product = products.find((p) => p.id === parseInt(req.params.id));
  res.render("product-details", { title: "Product Detail", product });
});
app.get("/products-form", (req, res) => {
  res.render("products-form", { title: "Add Product", product: {} });
});

app.get("/products-form/:id", (req, res) => {
  const products = readData();
  const product = products.find((p) => p.id === parseInt(req.params.id));
  res.render("products-form", { title: "Edit Product", product });
});

app.post("/products", (req, res) => {
  const products = readData();
  const newProduct = {
    id: Date.now(),
    ...req.body,
    // name: req.body.name,
    // price: parseFloat(req.body.price),
    // brand: req.body.brand,
  };
  products.push(newProduct);
  writeData(products);
  res.redirect("/products");
});

app.put("/products/:id", (req, res) => {
  const products = readData();
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = { id: products[index].id, ...req.body };
    writeData(products);
  }
  res.redirect("/products");
});

app.delete("/products/:id", (req, res) => {
  let products = readData();
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
  }
  writeData(products);
  res.redirect("/products");
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
