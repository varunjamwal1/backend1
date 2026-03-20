import Tax from '../models/Tax.js';

export const getTax = async (req, res) => {
  try {
    const tax = await Tax.findOne(); // Get the single tax
    if (!tax) {
      return res.status(404).json({ message: 'No tax configured' });
    }
    res.json(tax);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const createTax = async (req, res) => {
  try {
    // Check if tax already exists
    const existingTax = await Tax.findOne();
    if (existingTax) {
      return res.status(400).json({ 
        message: 'Only one tax record is allowed. Use PUT to update.' 
      });
    }
    
    const tax = await Tax.create(req.body);
    res.status(201).json(tax);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const updateTax = async (req, res) => {
  try {
    // First create if doesn't exist, then update
    let tax = await Tax.findOne();
    
    if (!tax) {
      // Create new tax if none exists
      tax = await Tax.create(req.body);
    } else {
      // Update existing tax
      tax = await Tax.findByIdAndUpdate(tax._id, req.body, { new: true });
    }
    
    res.json(tax);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const deleteTax = async (req, res) => {
  try {
    await Tax.deleteOne({}); // Delete the single tax document
    res.json({ message: 'Tax deleted' });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};