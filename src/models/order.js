const mongoose = require("mongoose");

const productSchema=  {
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity:{
        type: Number
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved", "Returning", "Refunded", "Request Return"]
    },
    expectedDate: {
      type: Date,
      default: Date.now()+4
    }
};

const addressSchema= {
    colony: {
        type: String
    },
    locality: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    }
};

const OrderSchema = new mongoose.Schema({
    nameOfUser: {
        type: String
    },
    emailOfUser:{
        type: String
    },
    contactOfUser: {
        type: Number
    },
    addressOfUser: {
        type: addressSchema,
    },
    products: {
        type: [productSchema]
    },
    typeOfPayment:{
        type: String,
        required: true
    },
    amount: { 
        type: Number, 
        required: true
    },
    dateOfPurchase: {
      type: Date,
      default: Date.now()
    }
  },
);

const Order = mongoose.model("orders", OrderSchema);

module.exports.Order = Order