<div align="center">
  <img src="https://github.com/daitasu/pan-shoot/blob/main/frontend/public/images/game_main_visual.png" width="400">
</div>

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=ts,go,postgres,vite" />
  </a>
</div>

# pan-shoot
パンを撃ち、敵を討つゲームです

## Summary
- 本職でいつも仲良くお世話になっているPdMの方を主人公としたシューティング・アクションゲームです(本人承諾済)
- PCでのみ動作します(スペースキーでパンを撃つ、カーソルキーで移動)

## Tech Stack
- Frontend: [PhaserJS](https://github.com/photonstorm/phaser), [Vite](https://ja.vitejs.dev/)
- Backend: [Golang](https://go.dev/)
- Hosting: [Fly.io](https://fly.io/) with PostgreSQL server

## Local development
### Prerequisites
- Install **Golang 1.19.x: https://go.dev/doc/install
- Install **yarn**: https://yarnpkg.com/getting-started/install
- Install **Docker**: https://docs.docker.com/engine/install
- Clone this repo: `git clone git@github.com:daitasu/pan-shoot.git`
- Run `go mod tidy` to install golang server dependencies
- Run `cd frontend & yarn install` to install frontend dependencies

### Setup local database

```
docker compose -d up
```

If you need DB auto migration, please run the following: (ref: [golang-migrate](https://github.com/golang-migrate/migrate))

```
migrate -database "postgresql://root:password@localhost:15432/devdb?sslmode=disable" -path db/migrations up
```

### Building Frontend

```
cd frontend/
yarn build
```

After build, an application bundle is produced under `/frontend/dist/` directory.

### Starting Server

```
go run cmd/main.go
```

Golang server serve with `/static/` of routes as static files server. 

After initialized, you can access the server at http://localhost:8080/static/ .
