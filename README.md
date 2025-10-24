# 🚗 Wheels

Wheels es una aplicación web que conecta **conductores y pasajeros** dentro de una comunidad universitaria para compartir viajes de manera segura, rápida y eficiente.

---

## 🧩 Estructura del Proyecto

Wheels/
├── frontend/ # Interfaz del usuario (HTML, CSS, JS)
│ ├── index.html
│ ├── styles.css
│ └── app.js
│
├── backend/ # API y lógica del servidor
│ ├── server.js
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ └── authController.js
│ ├── models/
│ │ ├── User.js
│ │ └── Vehicle.js
│ ├── routes/
│ │ └── auth.js
│ ├── middlewares/
│ │ └── errorHandler.js
│ ├── .env
│ └── package.json
│
├── .gitignore
└── README.md
