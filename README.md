# irembo-test-backend

## How to run the app

1. you have to install `nvm`
2. you must be having mongodb, campass better use local mongodb or upstream one.

```
nvm use
```

```
npm install
```

```
cp .env.example .env
```

```
npm run start
```

### System Structure

- Controller
  - AuthController
  - UserController
- Services
  - PasswordService
  - UserService
  - AuthService
  - ActivityService
- models
  - user
  - ActivityLog
- Routers
  - user
  - auth
- utils
- middleware
- enums
- errors

- app
