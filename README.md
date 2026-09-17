# E-Beer

[English](#english) · [Español](#español)

**Stack:** Node.js, Express, EJS, Sequelize, MySQL

---

## English

Online store for national and international beers, both craft and industrial. The site is for people over 18: you confirm your age on entry, then you can browse the catalog, product details, cart, login, and registration.

We specialize in national and international beers, craft and industrial. The goal is to offer quality products at a good price. We focus on customers over 18, which is a wide audience, so the site is meant to be dynamic, simple, and easy to use.

### Run locally

The app needs **Node.js** and **MySQL** on `127.0.0.1:3306`. It connects as `root` with **no password**, database name `grupo_13`. If your MySQL user or password is different, change `src/database/config/config.js` before starting the app.

#### Requirements

- [Node.js](https://nodejs.org/) 18 or later
- MySQL 8 (Docker is the easiest way; XAMPP or a local install also works)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you use the Docker option below

#### 1. Clone and install

```bash
git clone <your-repo-url>
cd e-beer
npm install
```

#### 2. Start MySQL and load the data

**Option A — Docker (recommended)**

```bash
docker run -d --name ebeer-mysql -p 3306:3306 \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=grupo_13 \
  mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Wait until MySQL is ready (about 15–20 seconds the first time), then load the schema and seed products:

```bash
docker exec -i ebeer-mysql mysql -uroot < db-setup/migrations9.sql
docker exec -i ebeer-mysql mysql -uroot < db-setup/seeders.sql
```

The next time you only need:

```bash
docker start ebeer-mysql
```

**Option B — MySQL already installed (XAMPP, Homebrew, etc.)**

Start MySQL, then from the project folder:

```bash
mysql -uroot < db-setup/migrations9.sql
mysql -uroot < db-setup/seeders.sql
```

If the `mysql` client is not in your PATH (common with XAMPP on macOS), use the full path, for example:

```bash
/Applications/XAMPP/xamppfiles/bin/mysql -uroot < db-setup/migrations9.sql
/Applications/XAMPP/xamppfiles/bin/mysql -uroot < db-setup/seeders.sql
```

#### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Si** on the age check.

| Script        | What it does                                              |
| ------------- | --------------------------------------------------------- |
| `npm run dev` | Starts the server with nodemon (restarts on file changes) |
| `npm start`   | Starts the server once, without watching files            |

Stop the app with `Ctrl+C`. To stop the Docker database:

```bash
docker stop ebeer-mysql
```

### Deploy on Render

Render can host the Node app. It does **not** include MySQL, so create a MySQL database first (Aiven, Railway, or similar) and copy the host, user, password, and database name.

1. Push this repo to GitHub.
2. In [Render](https://dashboard.render.com), create a **Web Service** from that repo.
3. Use:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add these environment variables:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | a long random string |
| `DB_HOST` | from your MySQL host |
| `DB_PORT` | `3306` (or the port they give you) |
| `DB_USER` | from your MySQL host |
| `DB_PASSWORD` | from your MySQL host |
| `DB_NAME` | from your MySQL host |
| `DB_SSL` | `true` |

5. After the first deploy, open the service **Shell** and run once:

```bash
npm run db:setup
```

That creates the tables and loads the seed products. Uploaded images will not persist on Render’s free disk.

---

## Español

E-commerce de cervezas nacionales e internacionales, artesanales e industriales. El sitio está pensado para mayores de 18 años: al entrar hay que confirmar la edad, y después se puede ver el catálogo, el detalle de cada producto, el carrito, login y registro.

Nuestra especialidad son las cervezas nacionales e internacionales, artesanales e industriales. Nuestro objetivo es ofrecer productos de calidad a un buen precio. Nos enfocamos en clientes mayores de 18 años, lo cual implica un público muy amplio, por lo que nuestro sitio es dinámico, simple y fácil de usar.

### Cómo ejecutarlo en local

La app necesita **Node.js** y **MySQL** en `127.0.0.1:3306`. Se conecta como `root` **sin contraseña**, base de datos `grupo_13`. Si tu usuario o contraseña de MySQL son distintos, cambiá `src/database/config/config.js` antes de iniciar la app.

#### Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- MySQL 8 (Docker es la forma más fácil; también sirve XAMPP o una instalación local)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) si usás la opción de Docker

#### 1. Clonar e instalar

```bash
git clone <your-repo-url>
cd e-beer
npm install
```

#### 2. Levantar MySQL y cargar los datos

**Opción A — Docker (recomendada)**

```bash
docker run -d --name ebeer-mysql -p 3306:3306 \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=grupo_13 \
  mysql:8.0 --default-authentication-plugin=mysql_native_password
```

Esperá a que MySQL esté listo (unos 15–20 segundos la primera vez) y después cargá el esquema y los productos:

```bash
docker exec -i ebeer-mysql mysql -uroot < db-setup/migrations9.sql
docker exec -i ebeer-mysql mysql -uroot < db-setup/seeders.sql
```

Las próximas veces solo hace falta:

```bash
docker start ebeer-mysql
```

**Opción B — MySQL ya instalado (XAMPP, Homebrew, etc.)**

Iniciá MySQL y, desde la carpeta del proyecto:

```bash
mysql -uroot < db-setup/migrations9.sql
mysql -uroot < db-setup/seeders.sql
```

Si el cliente `mysql` no está en el PATH (pasa seguido con XAMPP en macOS), usá la ruta completa, por ejemplo:

```bash
/Applications/XAMPP/xamppfiles/bin/mysql -uroot < db-setup/migrations9.sql
/Applications/XAMPP/xamppfiles/bin/mysql -uroot < db-setup/seeders.sql
```

#### 3. Iniciar la app

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y hacé clic en **Si** en el control de edad.

| Script        | Qué hace                                                         |
| ------------- | ---------------------------------------------------------------- |
| `npm run dev` | Inicia el servidor con nodemon (se reinicia al cambiar archivos) |
| `npm start`   | Inicia el servidor una vez, sin recarga automática               |

Para frenar la app usá `Ctrl+C`. Para frenar la base en Docker:

```bash
docker stop ebeer-mysql
```

### Subirlo a Render

Render puede hostear la app de Node. **No incluye MySQL**, así que primero creá una base MySQL (Aiven, Railway u otro) y copiá host, usuario, contraseña y nombre de la base.

1. Subí el repo a GitHub.
2. En [Render](https://dashboard.render.com) creá un **Web Service** desde ese repo.
3. Usá:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Agregá estas variables de entorno:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | un string largo y aleatorio |
| `DB_HOST` | de tu host de MySQL |
| `DB_PORT` | `3306` (o el puerto que te den) |
| `DB_USER` | de tu host de MySQL |
| `DB_PASSWORD` | de tu host de MySQL |
| `DB_NAME` | de tu host de MySQL |
| `DB_SSL` | `true` |

5. Después del primer deploy, abrí el **Shell** del servicio y ejecutá una vez:

```bash
npm run db:setup
```

Eso crea las tablas y carga los productos. Las imágenes subidas no se guardan de forma permanente en el disco gratis de Render.
