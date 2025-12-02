const express = require('express');
const mysql = require('mysql2');
const app = express();
var cors = require('cors');

app.use(cors());

const port= 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'root',
  database: 'citas'
});


db.connect(err => {
  if (err) console.error('DB connection error:', err);
  else console.log('DB conectado correctamente');
});


app.post("/agendar", (req, res) => {
  const { servicio, nombre, edad, fecha_nac, sexo, lugar_nac, fecha, hora } = req.body;

  const insertWithServicio = `INSERT INTO citas (servicio, nombre, edad, fecha_nac, sexo, lugar_nac, fecha, hora)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertWithServicio, [servicio, nombre, edad, fecha_nac, sexo, lugar_nac, fecha, hora], (err) => {

    // validacion dupli
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: "Ya existe una cita registrada en ese servicio, fecha y hora."
      });
    }

    
    if (err && err.code === 'ER_BAD_FIELD_ERROR' && /servicio/i.test(err.message)) {

      const insertNoServicio = `INSERT INTO citas (nombre, edad, fecha_nac, sexo, lugar_nac, fecha, hora)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(insertNoServicio, [nombre, edad, fecha_nac, sexo, lugar_nac, fecha, hora], (err2) => {
        if (err2) {
          console.error('Fallback insert error:', err2);
          return res.status(500).json({ error: err2.message });
        }
        return res.json({ message: "Registrado (sin servicio)" });
      });

    } else if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: err.message });
    }

    return res.json({ message: "Registrado" });
  });
});

app.get("/api/citas", async (req, res) => {
    db.query("SELECT nombre, fecha, servicio FROM citas", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
