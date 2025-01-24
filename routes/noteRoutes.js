const express = require("express");
const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all notes 
router.get("/", authenticate, getAllNotes);

// Create a new note 
router.post("/", authenticate, createNote);

// Update an existing note by ID 
router.put("/:id", authenticate, updateNote);

// Delete a note by ID 
router.delete("/:id", authenticate, deleteNote);

module.exports = router;
