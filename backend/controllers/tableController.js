import Table from '../models/Table.js';

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

export const deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};