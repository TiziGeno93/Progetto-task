const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Ottieni tutte le task per l'utente autenticato
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
});

// Aggiunge una nuova task
router.post("/", auth, async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({ title, user: req.user.userId });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
});

// Aggiorna una task
router.put("/:id", auth, async (req, res) => {
  const { title, completed } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, completed },
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task non trovata" });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
});

// Elimina una task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!task) return res.status(404).json({ message: "Task non trovata" });
    res.json({ message: "Task eliminata" });
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
});

router.patch("/:id/complete", auth, async (req, res) => {
  const { completed } = req.body; // Ci aspettiamo un JSON { "completed": true } o { "completed": false }
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { completed },
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task non trovata" });
    res.json(updatedTask);
  } catch (err) {
    console.error("Errore in PATCH /tasks/:id/complete", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;
