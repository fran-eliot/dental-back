# 🦷 Backend - Clínica Dental

Este es el backend del sistema de gestión de una clínica dental. Está construido con **NestJS**, utiliza **MySQL** como base de datos y **TypeORM** como ORM. El sistema permite gestionar pacientes, profesionales, citas, usuarios, disponibilidades y tratamientos.

---

## 🚀 Tecnologías principales

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/) para autenticación
- Swagger para documentación de la API

---

## ⚙️ Instalación

```bash
git clone https://github.com/tu-usuario/clinica-dental-backend.git
cd clinica-dental-backend
npm install
```

---

## 📄 Configuración .env

Debes crear un archivo .env en la raíz del proyecto con las siguientes variables:

JWT_SECRET: 'my-secret-key'

⚠️ Asegúrate de que tu base de datos clinica_dental esté creada previamente en MySQL.

---

## ▶️ Ejecución del proyecto

```bash
npm run start:dev
```

La API estará disponible en:
📍 http://localhost:3000

La documentación Swagger está disponible en:
📚 http://localhost:3000/api

---

### 🔐 Autenticación

El sistema utiliza autenticación con JWT y control de acceso basado en roles.
Los endpoints protegidos requieren un token válido en el encabezado:

Authorization: Bearer <tu_token_jwt>

---

## 🧱 Entidades principales

patients

professionals

appointments

availabilities

slots

users

treatments

---

## 📡 Endpoints principales

🔹 Auth

| Método | Endpoint      | Descripción   |
| ------ | ------------- | ------------- |
| POST   | `/auth/login` | Login con JWT |


🔹 Users

| Método | Endpoint                     | Descripción                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/users/alta`                | Alta de usuario            |
| GET    | `/users`                     | Obtener todos los usuarios |
| GET    | `/users/buscar/:id`          | Obtener usuario por ID     |
| PATCH  | `/users/:id/update_password` | Cambiar contraseña         |
| PATCH  | `/users/:id/rol_users`       | Cambiar rol de usuario     |
| PATCH  | `/users/:id/toggle_status`   | Activar/desactivar usuario |
| PATCH  | `/users/:id/username`        | Cambiar username           |

🔹 Patients

| Método | Endpoint                 | Descripción                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | `/patients/all`          | Listar todos los pacientes          |
| GET    | `/patients/search/:term` | Buscar por nombre, apellido o email |
| POST   | `/patients/alta`         | Crear nuevo paciente                |
| PUT    | `/patients/update/:id`   | Actualizar paciente                 |


🔹 Professionals

| Método | Endpoint                                         | Descripción                    |
| ------ | ------------------------------------------------ | ------------------------------ |
| POST   | `/professionals/alta`                            | Alta de profesional            |
| PUT    | `/professionals/actualizacion/:id_professionals` | Actualizar profesional         |
| GET    | `/professionals/all`                             | Listar todos los profesionales |
| GET    | `/professionals/por-user/:userId`                | Buscar por ID de usuario       |


🔹 Appointments (Reservas)

| Método | Endpoint                              | Descripción                          |
| ------ | ------------------------------------- | ------------------------------------ |
| POST   | `/appointments/nuevaReserva`          | Crear nueva reserva                  |
| GET    | `/appointments/reservas`              | Reservas del profesional autenticado |
| GET    | `/appointments/reservas/all`          | Todas las reservas                   |
| GET    | `/appointments/reservas/todas`        | Todas las reservas (duplicado?)      |
| GET    | `/appointments/reservas-por-fechas`   | Buscar por rango de fechas           |
| GET    | `/appointments/history/:patientId`    | Historial de citas de un paciente    |
| PATCH  | `/appointments/actualizar-estado/:id` | Cambiar estado de la cita            |


🔹 Disponibilidades

| Método | Endpoint                                               | Descripción                                      |
| ------ | ------------------------------------------------------ | ------------------------------------------------ |
| POST   | `/disponibilidades/genera-semana`                      | Generar para semana actual                       |
| POST   | `/disponibilidades/genera-mes`                         | Generar para un mes                              |
| GET    | `/disponibilidades/:professionalId/:date`              | Obtener disponibilidades por fecha               |
| PATCH  | `/disponibilidades/:id`                                | Cambiar estado de disponibilidad                 |
| GET    | `/disponibilidades/slots-libres/:professionalId/:date` | Slots disponibles para profesional en fecha      |
| DELETE | `/disponibilidades/limpieza/:beforeDate`               | Eliminar disponibilidades anteriores a una fecha |


🔹 Treatments

| Método | Endpoint           | Descripción             |
| ------ | ------------------ | ----------------------- |
| GET    | `/treatments/all`  | Obtener tratamientos    |
| POST   | `/treatments/alta` | Crear tratamiento nuevo |


---

## ✅ Estado del proyecto

✅ Funcional localmente

🔒 Protegido con JWT y control de roles

📄 Swagger disponible para documentación

🛠️ Aún no desplegado en entorno de producción

---

## 📁 Estructura del proyecto (simplificada)

src/
├── auth/
├── appointments/
├── patients/
├── professionals/
├── users/
├── availabilities/
├── treatments/
├── slots/
├── common/
└── main.ts

---

## 📌 Notas adicionales

La limpieza de disponibilidades antiguas debe ejecutarse manualmente con un DELETE.

Este backend se conecta con un frontend Angular en proyecto independiente.

---

## 🧑‍💻 Autor

Este proyecto ha sido desarrollado como parte de un sistema completo de gestión clínica dental.

