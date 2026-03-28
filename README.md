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

В проекте присутствуют предзаполненные тестовые аккаунты. Используйте их для быстрого входа и тестирования функционала.

## 📦 Начальные данные (миграции)

Следующие пользователи создаются автоматически:

| Email               | Пароль    |
|--------------------|----------|
| parent@example.com | demo12345 |
| child@example.com  | demo12345 |
| mentor@example.com | demo12345 |

---

## 🧪 Дополнительные тестовые данные

Если был выполнен скрипт `populate_data`, создаются дополнительные аккаунты:

### Родители
- parent1@example.com / password123
- parent2@example.com / password123
- parent3@example.com / password123

### Дети
- child1@example.com / password123
- child2@example.com / password123
- child3@example.com / password123
- child4@example.com / password123
- child5@example.com / password123
- child6@example.com / password123
- child7@example.com / password123

---

## 👨‍👩‍👧‍👦 Тестовые семьи

Дополнительно, функция `create_test_families()` создаёт:

- ivan@family.com / password123
- maria@family.com / password123
- alex@family.com / password123
- olga@family.com / password123

---

## ⚠️ Важно

- Все указанные аккаунты предназначены **только для разработки и тестирования**.
- Не используйте эти данные в продакшене.
- Рекомендуется изменить или удалить тестовые учетные записи перед релизом.
"""
