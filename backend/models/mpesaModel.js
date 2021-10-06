import mongoose from "mongoose";

const mpesaSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    Password: { type: String, required: true },
    TransactionType: { type: String, required: true },
    CallBackURL: { type: URL, required: true },
    AccountReference: { type: String, required: false },
    TransactionDesc: { type: String, required: false },
    BusinessShortCode: {
      type: Number,
      required: true,
    },
    PartyA: {
      type: Number,
      required: true,
    },
    PartyB: {
      type: Number,
      required: true,
    },
    PhoneNumber: {
      type: Number,
      required: true,
    },

    Amount: {
      type: Number,
      required: true,
      default: 0.0,
    },

    Timestamp: {
      type: Date,
    },
  },
  {
    timestamps: true, // mongoose creates time fields (createdAt & updatedAt) automatically
  }
);

const Mpesa = mongoose.model("Mpesa", mpesaSchema);

export default Mpesa;
