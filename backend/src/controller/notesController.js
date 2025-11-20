import Note from "../models/notes.js";
export async function getNotes(req, res) {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1  });
        res.status(200).json(notes);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });

    }
};

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Error Note not found" });
        // Safely check if note belongs to the user (handle legacy notes without userId)
        const ownerId = note.userId ? note.userId.toString() : null;
        if (ownerId !== req.userId) {
            return res.status(403).json({ message: "Not authorized to access this note" });
        }

        res.status(201).json(note);
    }
    catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function createNote (req, res){
    try {
        const { title, content } = req.body;
        const newNote = new Note({ userId: req.userId, title, content });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    }
    catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function  updateNote(req, res){
    try {
        const { title, content } = req.body;
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        
        // Safely check if note belongs to the user
        const ownerId = note.userId ? note.userId.toString() : null;
        if (ownerId !== req.userId) {
            return res.status(403).json({ message: "Not authorized to update this note" });
        }
        
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    }
    catch (error) {
         console.error("Error updating note:", error);
         res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function deleteNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        
        // Safely check if note belongs to the user
        const ownerId = note.userId ? note.userId.toString() : null;
        if (ownerId !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this note" });
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Note deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting note:", error);
         res.status(500).json({ message: "Internal Server Error" });
    }
};