const express = require("express");
const checksumLib = require("./Paytm/checksum/checksum");
const port = 3000;
var path = require('path');

const app = express();

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/pay", [parseUrl, parseJson], (req, res) => {

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.firstname,
    customerEmail: req.body.email,
    customerPhone: req.body.phone,
  };
  let params = {};
  params["MID"] = "uDInid37587374103313";
  params["WEBSITE"] = "WEBSTAGING";
  params["CHANNEL_ID"] = "WEB";
  params["INDUSTRY_TYPE_ID"] = "Retail";
  params["ORDER_ID"] = "ORD" + new Date().getTime();
  params["CUST_ID"] = paymentDetails.customerId;
  // params["CALLBACK_URL"] = "https://C:\Users\Suryansh\Desktop\paytm";
  // params["CALLBACK_URL"] = "http://localhost:" + port + "/callback";
  params["CALLBACK_URL"] = "http://localhost:3000/callback";
  params["MOBILE_NO"] = paymentDetails.customerPhone;
  params["EMAIL"] = paymentDetails.customerEmail;
  params["TXN_AMOUNT"] = paymentDetails.amount;

  checksumLib.genchecksum(params, "9lXKZ#MTKN13FDFp", (err, checksum) => {
    let url = "https://securegw-stage.paytm.in/order/process";
    let formFields = "";
    for (x in params) {
      formFields +=
        "<input type = 'hidden' name = '" +
        x +
        "' value = '" +
        params[x] +
        "'/>";
    }
    formFields +=
      "<input type = 'hidden' name = 'CHECKSUMHASH' value = '" +
      checksum +
      "'>";

    var html =
      '<html><body><center>Please do not refresh this page...</center><form method = "post" action = "' +
      url +
      '" name = "paymentForm">' +
      formFields +
      '</form><script type = "text/javascript">document.paymentForm.submit()</script></body></html>';
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
  });
});


app.post("/callback", (req, res) => {

  res.sendFile(path.join(__dirname + '/index1.html'));

});
     

app.listen(3000, () => console.log("App is running at port 3000..."));
