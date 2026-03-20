import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('category').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createItem = async (req, res) => {
  try {
    console.log("📥 Create Item - Body:", req.body);
    console.log("📥 Create Item - File:", req.file);

    const { name, description, price, category, type, isPopular, isAvailable } = req.body;
    
    if (!name || !price || !type) {
      return res.status(400).json({ message: "Name, price, and type are required" });
    }

    const image = req.file ? req.file.path : '';

    const item = new Item({
      name, 
      description, 
      price: Number(price), 
      category, 
      type, 
      isPopular: isPopular === 'true', 
      isAvailable: isAvailable !== 'false', 
      image,
    });
    
    await item.save();
    res.status(201).json(item);
  } catch (err) { 
    console.error("❌ Create Item Error:", err);
    res.status(500).json({ message: err.message }); 
  }
};

export const updateItem = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.isPopular) updateData.isPopular = updateData.isPopular === 'true';
    if (updateData.isAvailable) updateData.isAvailable = updateData.isAvailable !== 'false';

    const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(item);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const togglePopular = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    item.isPopular = !item.isPopular;
    await item.save();
    res.json(item);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};