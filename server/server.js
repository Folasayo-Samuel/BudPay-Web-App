const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my web application!");
});

app.get("/generate-token", async (req, res) => {
  try {
    // Pass your public key and secret key to generate a Bearer Token
    const response = await axios.post(
      "https://apis.budpay.ng/api/v2/encrypt/key",
      {
        publicKey: process.env.BudPay_PUBLIC_KEY,
        secretKey: process.env.BudPay_SECRET_KEY,
      }
    );

    // Extract the token from the response
    const { token } = response.data;

    // Send the token as the response
    res.send(token);
  } catch (error) {
    console.error(error);
    if (error.code === "ETIMEDOUT") {
      res
        .status(500)
        .send("Connection to BudPay API timed out. Please try again later.");
    } else {
      res.status(500).send("An error occurred while generating the token.");
    }
  }
});

app.post("/checkout", async (req, res) => {
  try {
    // Retrieve customer details from the request body
    const { email, amount, currency } = req.body;

    // Generate a Bearer Token by making a request to the '/generate-token' endpoint
    const tokenResponse = await axios.get(
      "http://localhost:5000/generate-token"
    );
    const token = tokenResponse.data;

    // Make a request to BudPay API to initialize the transaction and get the checkout link
    const response = await axios.post(
      "https://api.budpay.ng/api/v2/payments",
      {
        email,
        amount,
        currency,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle the response from BudPay API
    const { checkoutLink } = response.data;
    res.send(
      `Click <a href="${checkoutLink}">here</a> to complete the payment.`
    );
  } catch (error) {
    console.error(error);
    res.send("An error occurred while initializing the transaction.");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
