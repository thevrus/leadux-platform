# RockUX

## Development server

- [rockux-platform-dev.herokuapp.com](https://rockux-platform-dev.herokuapp.com/) – API
- [rockux-platform-dev.herokuapp.com/admin](https://rockux-platform-dev.herokuapp.com/admin) – Admin

## Production server

- [rockux-platform.herokuapp.com](https://rockux-platform.herokuapp.com/) – API
- [rockux-platform.herokuapp.com/admin](https://rockux-platform.herokuapp.com/admin) – Admin

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
