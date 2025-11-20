import express from "express";
import { createNote, getNotes, updateNote,deleteNote,getNoteById } from "../controller/notesController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // Protect all notes routes
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id",deleteNote);

export default router;