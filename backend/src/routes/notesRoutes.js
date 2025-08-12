import express from "express";
import { createNote, getNotes, updateNote,deleteNote,getNoteById } from "../controller/notesController.js";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);// nodemon for realtime update
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id",deleteNote);

export default router;