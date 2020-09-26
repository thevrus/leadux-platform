# LeadUX

## Development server

- [leadux-platform-dev.herokuapp.com](https://leadux-platform-dev.herokuapp.com/) – API
- [leadux-platform-dev.herokuapp.com/admin](https://leadux-platform-dev.herokuapp.com/admin) – Admin

## Production server

- [leadux-platform.herokuapp.com](https://leadux-platform.herokuapp.com/) – API
- [leadux-platform.herokuapp.com/admin](https://leadux-platform.herokuapp.com/admin) – Admin

---

### Production connection `MongoDB`

Create `.env` file, paste code bellow and update variables values

```js
DATABASE_HOST='cluster.foo.mongodb.net'
DATABASE_SRV=true
DATABASE_PORT=27017
DATABASE_NAME='db_name'
DATABASE_USERNAME='username'
DATABASE_PASSWORD='password'
```

### Development connection `SQLite`

Create `.env` file, paste code bellow and update variables values

```js
HOST=0.0.0.0
PORT=1337

MODE='development'
```
