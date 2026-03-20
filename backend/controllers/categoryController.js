import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    console.log("📥 Create Category - Body:", req.body);
    console.log("📥 Create Category - File:", req.file);

    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Get image URL from Cloudinary
    const image = req.file ? req.file.path : '';

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("❌ Create Category Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};