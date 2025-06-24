# 🦷 Clínica Dental – Backend API

![NestJS](https://img.shields.io/badge/NestJS-Backend-red)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![License](https://img.shields.io/badge/license-Educational-lightgrey)

Este repositorio contiene el backend de una aplicación de gestión de citas para una clínica dental. Está desarrollado con [NestJS](https://nestjs.com/) y utiliza una base de datos relacional MySQL, conectada a través de TypeORM.

---

## ⚙️ Tecnologías utilizadas

- **Framework:** NestJS
- **Base de datos:** MySQL
- **ORM:** TypeORM
- **Autenticación:** JWT
- **Control de acceso:** Por roles (`admin`, `dentista`)
- **Documentación de la API:** Swagger (`http://localhost:3000/api`)
- **Gestor de paquetes:** npm

---

## 🏥 Modelo de datos

El modelo de datos está definido en el siguiente Diagrama de Entidad-Relación (DER), generado con **MySQL Workbench**:

![Modelo ER](./docs/DER%20clinica_dental.png)

### 🧱 Entidades principales

- `users`: Usuarios del sistema con credenciales, roles y estado.
- `professionals`: Profesionales de la clínica (asociados a un `user`).
- `patients`: Pacientes que pueden tener citas registradas.
- `appointments`: Citas médicas con fecha, duración, profesional, paciente, tratamiento y estado.
- `availabilities`: Disponibilidades por profesional y fecha, divididas en `slots`.
- `slots`: Franjas horarias fijas del día (ej. 10:00–10:30).
- `treatments`: Tratamientos dentales ofrecidos.

---

### 🔁 Relaciones entre entidades

- `users` ⟶ `professionals` → **OneToMany**
- `professionals` ⟶ `availabilities` → **OneToMany**
- `patients` ⟶ `appointments` → **OneToMany**
- `professionals` ⟶ `appointments` → **OneToMany**
- `treatments` ⟶ `appointments` → **OneToMany**
- `slots` ⟶ `availabilities` → **OneToMany**
- `slots` ⟶ `appointments` → **OneToMany**

---

### 📚 Valores ENUM

- `status_appointments`: `Pendiente`, `Confirmada`, `Realizada`, `Cancelada`
- `rol_users`: `admin`, `dentista` (⚠️ futura mejora: `paciente`)
- `status_availability`: `Libre`, `Ocupado`, `No Disponible`
- `period`: `Mañana`, `Tarde`
- `created_by_appointments`: `user` (actualmente siempre `admin`)

---

## 🧪 Requisitos previos

- Node.js >= 18
- npm >= 9
- MySQL >= 8

---

## 🚀 Instalación y ejecución

```bash
# Clona el repositorio
git clone https://github.com/tuusuario/backend-clinica-dental.git
cd backend-clinica-dental

# Instala dependencias
npm install

# Crea un archivo .env con la configuración necesaria (base de datos, JWT, etc.)

# Ejecuta el proyecto
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
La API estará disponible en:
📍 http://localhost:3000

La documentación Swagger está disponible en:
📚 http://localhost:3000/api
---

## 📄 Configuración .env

- Debes crear un archivo .env en la raíz del proyecto con las siguientes variables:

    JWT_SECRET: 'my-secret-key'

- ⚠️ Asegúrate de que tu base de datos clinica_dental esté creada previamente en MySQL.

---

### 🔐 Autenticación y roles

- Autenticación basada en JWT.

- Al hacer login, el backend devuelve un token que debe incluirse en la cabecera Authorization para acceder a endpoints protegidos.

    Authorization: Bearer <tu_token_jwt>

- Control de acceso por roles (admin, dentista) para limitar el uso de funcionalidades según el tipo de usuario.

---

## 📡 Endpoints principales

🔹 Auth

| Método | Endpoint      | Descripción                |
| ------ | ------------- | -------------------------- |
| POST   | `/auth/login` | Autenticación mediante JWT |


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
| GET    | `/appointments/reservas/todas`        | Todas las reservas (sin filtros)     |
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

| Método | Endpoint                                  | Descripción             |
| ------ | ------------------------------------------| ----------------------- |
| GET    | `/treatments/all`                         | Obtener tratamientos    |
| POST   | `/treatments/alta`                        | Crear tratamiento nuevo |
| PUT    | `/treatments/actualizar-tratamiento/:id`  | Actualizar tratamiento  |


---

## 📁 Estructura del proyecto (simplificada)

```plaintext
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
```

---

## 📌 Notas adicionales

- La eliminación de disponibilidades antiguas se realiza manualmente mediante un endpoint DELETE.

- Este backend se conecta con un frontend desarrollado en Angular (dental-front), alojado en un repositorio independiente en https://github.com/fran-eliot/dental-front

---

## 🧩 Contribución y mejoras futuras

- Añadir rol de paciente y registro/autogestión desde frontend

- Panel de administración más completo

- Tests automáticos

- Soporte para internacionalización

## 🧑‍💻 Autores

Este proyecto ha sido desarrollado como parte de un sistema completo de gestión clínica dental, para el curso "Desarrollo Frontend con Angular" de Fundación Adecco.

Los autores del proyecto son:
- [Ainhoa Alonso](https://github.com/AinhoaAlonso)
- [Fran Ramírez](https://github.com/fran-eliot)
- [Asusalin Abou](https://github.com/asusalin)

---

## 📄 Licencia

- Este proyecto ha sido desarrollado con fines educativos. 
- No está destinado a uso comercial y no incluye una licencia explícita. 
- Para reutilización o distribución, por favor contacta con los autores.

