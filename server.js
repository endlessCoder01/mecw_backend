const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Paynow } = require("paynow");
require('dotenv').config();

const app = express();
const route = require("./Database/router");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use("/mecw", route);



const INTEGRATION_ID = process.env.INTEGRATION_ID;
const INTEGRATION_KEY = process.env.INTEGRATION_KEY;


let paynow = new Paynow( INTEGRATION_ID, INTEGRATION_KEY);

paynow.resultUrl = "http://localhost:5000/gateways/paynow/update";
// paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

app.post('/pay', async (req, res) => {
  const mobileNumber = req.body.contactNumber ;
  const name = req.body.name;
  const amount = req.body.amount

  if (!mobileNumber) {
    return res.status(400).json({ error: 'Mobile number is required.' });
  }

  try {
    let payment = paynow.createPayment("Invoice 37", "tawandachapaguta@gmail.com");

    payment.add(name, amount);
   

    const response = await paynow.sendMobile(payment, mobileNumber, 'ecocash');

    if (response.success) {
      let instructions = response.instructions;
      let pollUrl = response.pollUrl;

      
      console.log(instructions);
      console.log(pollUrl);
      return res.json({ instructions, pollUrl });
   
    } else {
      return res.status(500).json({ error: response.error });
    }
  } catch (ex) {
    console.error('Error processing payment:', ex);
    return res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
});


app.get('/check-payment-status', async (req, res) => {
  const pollUrl = req.query.pollUrl; 

  if (!pollUrl) {
    return res.status(400).json({ error: 'Poll URL is required.' });
  }

  try {
    let status = await paynow.pollTransaction(pollUrl);
    
    console.log("Payment status:", status);
  
    if (status.status === "paid") {
      return res.status(200).json({ status: 200, message: 'Transaction paid.' });
    } else if (status.status === "pending") {
      console.log("Why you no pay?");
      return res.status(202).json({ status: 202, message: 'Pending payment.' }); 
    } else if (status.status === "failed") {
      console.log("Why you no pay?");
      return res.status(401).json({ status: 401, message: 'Failed payment.' }); 
    } else if (status.status === "cancelled") {
      return res.status(400).json({ status: 400, message: 'Cancelled payment.' }); 
    } else if (status.status === "sent") { 
      return res.status(202).json({ status: 202, message: 'Payment sent, awaiting confirmation.' }); 
    } else {
      console.log("honsaiwo", status);
      return res.status(400).json({ status: 400, message: 'Unknown status' }); 
    }
  } catch (error) {
    console.error('Error polling transaction status:', error);
    return res.status(500).json({ error: 'An error occurred while checking the payment status.' });
  }
});





// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/mecw", (req, res) => {
  res.send("Ministry of Environment, Climate And Wildlife Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));