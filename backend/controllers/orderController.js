
import Order from "../models/Order.js";



export const getOrders = async (req, res) =>
{
  try
  {
    const { status, source, limit = 50 } = req.query;

    const filter = {};

    if (status) filter.status = status;

    if (source) filter.orderSource = source;

    const orders = await Order.find(filter)
      .populate("table","name")
      .populate("createdBy","name role")
      .populate("approvedBy","name")
      .sort({ createdAt:-1 })
      .limit(Number(limit))
      .lean();

    res.json(orders);
  }
  catch(err)
  {
    res.status(500).json({ message: err.message });
  }
};



export const getCustomerOrders = async (req,res)=>
{
  try
  {
    const { status, limit=50 } = req.query;

    const filter =
    {
      orderSource:"customer"
    };

    if(status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt:-1 })
      .limit(Number(limit))
      .lean();

    res.json(orders);
  }
  catch(err)
  {
    res.status(500).json({message:err.message});
  }
};



export const createOrder = async (req,res)=>
{
  try
  {
    const { customerName, items } = req.body;

    if(!customerName || !items || items.length===0)
    {
      return res.status(400).json({
        message:"Customer name and items required"
      });
    }

    const orderData = {
      ...req.body
    };

    if(req.user)
    {
      orderData.createdBy = req.user._id;
      orderData.orderSource = "staff";
    }
    else
    {
      orderData.orderSource = "customer";
    }

    const order = await Order.create(orderData);

    const populated = await Order.findById(order._id)
      .populate("table","name")
      .populate("createdBy","name role")
      .populate("approvedBy","name");

    res.status(201).json(populated);
  }
  catch(err)
  {
    res.status(500).json({message:err.message});
  }
};



// export const approveOrder = async (req,res)=>
// {
//   try
//   {
//     const order = await Order.findById(req.params.id);

//     if(!order)
//       return res.status(404).json({message:"Order not found"});

//     if(order.status !== "pending")
//       return res.status(400).json({
//         message:"Only pending orders can be approved"
//       });

//     order.status = "approved";
//     order.approvedBy = req.user._id;
//     order.approvedAt = new Date();

//     await order.save();

//     res.json({
//       message:"Order approved",
//       order
//     });
//   }
//   catch(err)
//   {
//     res.status(500).json({message:err.message});
//   }
// };
export const approveOrder = async (req, res) => {

  try {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be approved"
      });
    }

    order.status = "approved";

    await order.save();

    res.json({
      message: "Order approved successfully",
      order
    });

  } catch (error) {

    console.error("Approve order error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


export const updateOrderStatus = async (req,res)=>
{
  try
  {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if(!order)
      return res.status(404).json({message:"Order not found"});

    order.status = status;

    await order.save();

    res.json({
      message:"Order updated",
      order
    });
  }
  catch(err)
  {
    res.status(500).json({message:err.message});
  }
};



export const cancelOrder = async (req,res)=>
{
  try
  {
    const order = await Order.findById(req.params.id);

    if(!order)
      return res.status(404).json({message:"Order not found"});

    order.status = "cancelled";

    await order.save();

    res.json({
      message:"Order cancelled",
      order
    });
  }
  catch(err)
  {
    res.status(500).json({message:err.message});
  }
};



export const getOrderStats = async (req,res)=>
{
  try
  {
    const totalOrders = await Order.countDocuments();

    const totalSalesAgg = await Order.aggregate([
      { $match:{status:"completed"} },
      { $group:{ _id:null, total:{ $sum:"$totalAmount"} } }
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    const pendingApprovals = await Order.countDocuments({
      status:"pending",
      orderSource:"customer"
    });

    res.json({
      totalOrders,
      totalSales,
      pendingApprovals
    });
  }
  catch(err)
  {
    res.status(500).json({message:err.message});
  }
};
export const completeOrder = async (req, res) => {
  try {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be completed"
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        message: "Order already completed"
      });
    }

    // Update order
    order.status = "completed";
    order.paymentStatus = "paid";
    order.completedAt = new Date();

    await order.save();

    res.json({
      message: "Order completed successfully",
      order
    });

  } catch (error) {

    console.error("Complete order error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};