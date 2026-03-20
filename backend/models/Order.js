
// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
// {
//   customerName: {
//     type: String,
//     required: true
//   },

//   phone: String,

//   table: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Table"
//   },

//   items: [
//     {
//       item: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Item"
//       },

//       name: {
//         type: String,
//         required: true
//       },

//       price: {
//         type: Number,
//         required: true
//       },

//       quantity: {
//         type: Number,
//         required: true,
//         min: 1
//       }
//     }
//   ],

//   subtotal: {
//     type: Number,
//     required: true,
//     min: 0
//   },

//   taxAmount: {
//     type: Number,
//     default: 0
//   },

//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },

//   orderSource: {
//     type: String,
//     enum: ["staff", "customer", "counter"],
//     default: "customer"
//   },

//   orderType: {
//     type: String,
//     enum: ["dine-in", "takeaway", "delivery"],
//     default: "dine-in"
//   },

//   status: {
//     type: String,
//     enum: [
//       "pending",
//       "approved",
//       "preparing",
//       "ready",
//       "completed",
//       "cancelled"
//     ],
//     default: "pending"
//   },

//   approvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   approvedAt: Date,

//   paymentMethod: {
//     type: String,
//     enum: ["cash", "online", "card"],
//     required: true
//   },

//   paymentStatus: {
//     type: String,
//     enum: ["pending", "paid", "failed"],
//     default: "pending"
//   },

//   razorpayOrderId: String,
//   razorpayPaymentId: String,

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   notes: String,

//   orderNumber: {
//     type: String,
//     unique: true
//   }
// },
// {
//   timestamps: true
// }
// );



// OrderSchema.pre("save", function (next)
// {
//   if (!this.orderNumber)
//   {
//     const date = new Date().toISOString().slice(0,10).replace(/-/g,"");

//     this.orderNumber =
//       `ORD${date}${Math.random().toString(36).substring(2,6).toUpperCase()}`;
//   }

//   if (this.createdBy)
//   {
//     this.orderSource = "staff";
//     this.status = "completed";
//     this.paymentStatus = "paid";
//   }
//   else
//   {
//     this.orderSource = "customer";

//     if (!this.status)
//       this.status = "pending";

//     if (!this.paymentStatus)
//       this.paymentStatus = "pending";
//   }

//   next();
// });


// const Order = mongoose.model("Order", OrderSchema);

// export default Order;

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    phone: String,

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },

    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    orderSource: {
      type: String,
      enum: ["staff", "customer", "counter"],
      default: "customer",
    },

    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      default: "dine-in",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,

    paymentMethod: {
      type: String,
      enum: ["cash", "online", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: String,

    orderNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook for order number and default statuses
OrderSchema.pre("save", function (next) {
  // 1️⃣ Generate order number if not present
  if (!this.orderNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD${date}${randomCode}`;
  }

  // 2️⃣ Set source and default statuses
  if (this.createdBy) {
    // Staff-created order
    this.orderSource = "staff";
    this.status = "completed";
    this.paymentStatus = "paid";
  } else {
    // Customer order
    this.orderSource = "customer";
    if (!this.status) this.status = "pending";
    if (!this.paymentStatus) this.paymentStatus = "pending";
  }

  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;