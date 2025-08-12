import Note from "../models/notes.js";
export async function getNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1  });
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
        const newNote = new Note({ title, content });
        newNote.save();
        res.status(201).json({ message: "Note created successfully" });
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function  updateNote(req, res){
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    }
    catch (error) {
         console.error("Error fetching notes:", error);
         res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deletedNote successfully" });
    }
    catch (error) {
        console.error("Error fetching notes:", error);
         res.status(500).json({ message: "Internal Server Error" });
    }
};