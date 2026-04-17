const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require('dns').setDefaultResultOrder('ipv4first');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/contacts", async (req, res) => {
  try {
    const data = await Contact.find();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.delete("/contact/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully ✅");
  } catch (error) {
    res.status(500).send("Delete error ❌");
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).send("All fields required");
    }

    const newData = new Contact({ name, email, address });
    await newData.save();

    res.send("Data saved successfully ✅");
  } catch (error) {
    res.status(500).send("Server error ❌");
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.delete("/contact/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send("Data not found ❌");
    }

    res.send("Deleted successfully ✅");

  } catch (error) {
    console.log(error);
    res.status(500).send("Delete error ❌");
  }
});