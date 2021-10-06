import asyncHandler from "express-async-handler";
import axios from "axios";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { mpesaItems } from "../controllers/mpesaController.js";

const router = express.Router();

// @desc    Paypal
// @route   GET /api/config/paypal
// @access  Private
const Paypal = asyncHandler(async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// @desc    Mpesa Access-Token
// @route   GET /api/config/mpesa
// @access  Private
const mpesaAuth = asyncHandler(async (req, res, next) => {
  const Keys = new Buffer.from(
    `${process.env.MPESA_KEY}:${process.env.MPESA_SECRET}`,
    "utf-8"
  ).toString("base64");

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Keys}`,
        },
      }
    )
    .then((resp) => {
      let accessToken = resp.data.access_token;
      req.accessToken;

      res.status(200).send({
        success: true,
        accessToken: accessToken,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
});

// @desc    Lipa na Mpesa
// @route   POST /api/config/lipaNaMpesa
// @access  Private
const lipaNaMpesa = asyncHandler(async (req, res) => {
  let PassKey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  let ShortCode = "174379";

  const timeStamp = () => {
    const date = "20210926182137";
    return date;
  };

  const generatePassword = () => {
    const passString = `${PassKey}${ShortCode}${timeStamp()}`;
    const pwd = new Buffer.from(passString).toString("base64");
    return pwd;
  };

  let data = {
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
  // console.log(timeStamp());

  const mpesa_token = req.accessToken;

  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mpesa_token}`,
        },
      }
    )
    .then((resp) => {
      // console.log(resp.data);
      res.status(200).json({
        success: true,
        data: resp.data,
      });
    })
    .catch((err) => {
      res.status(err.response.status).json({
        success: false,
        message: err.message,
      });
    });
});

router.route("/paypal").get(protect, Paypal);
router.route("/mpesa").get(protect, mpesaAuth);
router.route("/mpesapayment").post(lipaNaMpesa);

export default router;
