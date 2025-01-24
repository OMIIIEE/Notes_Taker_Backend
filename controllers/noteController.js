const Note = require("../models/Note");

// Get all notes for a user
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).populate("user", "username email");
    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const note = new Note({
      user: req.user.userId,
      title,
      content,
    });

    await note.save();
    res.status(201).json({ success: true, message: "Note created successfully", note });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Update an existing note
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { title, content },
      { new: true } // Return the updated document
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ success: true, message: "Note updated successfully", note });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
