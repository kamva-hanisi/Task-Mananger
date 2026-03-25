exports.getTasks = (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};
