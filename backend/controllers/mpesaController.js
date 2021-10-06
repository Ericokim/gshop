import asyncHandler from "express-async-handler";
import Mpesa from "../models/orderModel.js";

// @desc   Mpesa Payment
// @route  POST /api/config/lipaNaMpesa
// @access Private
export const mpesaItems = asyncHandler(async (req, res) => {
  let PassKey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  let ShortCode = "174379";

  const timeStamp = () => {
    const date = datetime.create();
    const timestamp = date.format("YmdHMS");
    return timestamp;
  };

  const generatePassword = () => {
    const passString = `${PassKey}${ShortCode}${timeStamp()}`;
    const pwd = new Buffer.from(passString).toString("base64");
    return pwd;
  };

  req.body = {
    BusinessShortCode: "174379",
    Password: generatePassword(),
    Timestamp: timeStamp(),
    TransactionType: "CustomerPayBillOnline",
    Amount: "1",
    PartyA: "254708374149",
    PartyB: "174379",
    PhoneNumber: "254708374149" /**phone no to push stk to */,
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "CompanyXLTD",
    TransactionDesc: "Lipa na mpesa",
  };

  if (Amount === 0) {
    res.status(400);
    throw new Error("No Amount added");
    return;
  } else {
    const Items = new Mpesa({
      BusinessShortCode,
      Password,
      Timestamp,
      TransactionType,
      Amount,
      PartyA,
      PartyB,
      PhoneNumber,
      CallBackURL,
      AccountReference,
      TransactionDesc,
    });

    const MpesaPayment = await Items.save();
    res.status(201).json(MpesaPayment);
  }
});
