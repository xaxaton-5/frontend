## Инструкция по деплою с помощью Docker Compose

**1. Клонировать репозиторий**

```
git clone https://github.com/xaxaton-5/frontend
```

**2. Перейти в папку с проектом**

```
cd frontend
```

**3. Задать переменные окружения**

Создать .env в корне по примеру из .env.template (поменять VITE_API_BASE_URL и VITE_WEB_SOCKET_URL, если требуется другой url до api):

**4. Запустить контейнер**

```
docker compose up --build
```

**5. Теперь приложение доступно по адресу http://localhost**

## Инструкция по деплою с помощью Docker

**1. Клонировать репозиторий**

```
git clone https://github.com/xaxaton-5/frontend
```

**2. Перейти в папку с проектом**

```
cd frontend
```

**3. Задать переменные окружения**

Создать .env в корне по примеру из .env.template (поменять VITE_API_BASE_URL и VITE_WEB_SOCKET_URL, если требуется другой url до api):

**4. Собрать Docker-образ (вместо xaxaton-team-4-frontend может быть ваше название)**

```
docker build -t xaxaton-team-4-frontend .
```

**5. Запустить контейнер**

```
docker run -p 80:80 xaxaton-team-4-frontend
```

**6. Теперь приложение доступно по адресу http://localhost**

## Инструкция по деплою без использования Docker

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

```
npm i
```

**5. Задать переменные окружения**

Создать .env в корне по примеру из .env.template (поменять VITE_API_BASE_URL и VITE_WEB_SOCKET_URL, если требуется другой url до api):

**6. Собрать проект**

```
npm run build
```

**7. В папке dist файлы проекта для дальнейшего деплоя**

**8. Чтобы посмотреть собранный проект локально**

```
npm run preview
```

# 🔐 Тестовые пользователи


- Пароль: `password123`

Взрослые аккаунты (родители), которые создаются по умолчанию:

- `ivan.petrov@example.com`
- `maria.sokolova@example.com`
- `sergey.ivanov@example.com`

Детские аккаунты, которые создаются по умолчанию:

- `alexey.petrov@example.com`
- `olga.sokolova@example.com`
- `nikita.ivanov@example.com`
- `alina.smirnova@example.com`
- `egor.kozlov@example.com`
- `polina.fedorova@example.com`
- `maksim.novikov@example.com`
