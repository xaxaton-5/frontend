## Быстрый локальный запуск одной командой

По умолчанию фронтенд теперь использует локальные адреса:

- API: `http://localhost:5000/api`
- WebSocket: `ws://localhost:5001/ws`

Если ваш backend слушает эти адреса, достаточно одной команды:

```bash
docker compose up --build
```

После этого приложение будет доступно по адресу `http://localhost:8080`.

## Запуск Docker с другими адресами

Если backend работает не на локальных адресах по умолчанию, можно переопределить их через `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WEB_SOCKET_URL=ws://localhost:5001/ws
FRONTEND_PORT=8080
```

Потом снова запустить:

```bash
docker compose up --build
```

## Запуск без Docker

**1. Установить node.js 22**

```
https://nodejs.org/en/download
```

**2. Клонировать репозиторий**

```
git clone https://github.com/xaxaton-5/frontend
```

**3. Перейти в папку с проектом**

```
cd frontend
```

**4. Установить зависимости**

```bash
npm i
```

**5. Запустить проект**

```bash
npm run dev
```

Без `.env` фронтенд будет обращаться к локальному backend на:

- `http://localhost:5000/api`
- `ws://localhost:5001/ws`

Если нужны другие адреса, создайте `.env` по примеру из `.env.example` или `.env.template`.

**6. Сборка production**

```bash
npm run build
```

**7. Просмотр production-сборки локально**

```bash
npm run preview
```
