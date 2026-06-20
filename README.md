# OpsMonitor Backend

Monorepo NestJS con tres aplicaciones independientes, cada una siguiendo
**DDD** (Domain-Driven Design) con repositorios personalizados, y una librería
compartida `@app/repository` que centraliza la capa de acceso a datos.

## Apps

| App         | Puerto | Persistencia        | Bounded context                  |
| ----------- | ------ | ------------------- | -------------------------------- |
| `events`    | 3001   | PostgreSQL (TypeORM)| Registro de eventos operativos   |
| `incidents` | 3002   | MongoDB (Mongoose)  | Gestión de incidentes            |
| `alerts`    | 3003   | Redis (ioredis)     | Envío y seguimiento de alertas   |

> La asignación de un motor distinto por app es deliberada: demuestra las tres
> tecnologías soportadas por `libs/repository`. Todas comparten el mismo patrón
> de repositorio base.

## Estructura

```
apps/
  events|incidents|alerts/
    src/
      domain/          # Aggregates, value objects, puerto del repositorio (interface)
      application/     # Servicios / casos de uso (dependen solo del puerto)
      infrastructure/  # Repositorio concreto + mapper (adapta libs/repository)
      presentation/    # Controllers + DTOs (class-validator)
      main.ts          # Bootstrap de la app
libs/
  repository/          # Data Access Layer compartido
    src/
      base/            # Repositorios abstractos (TypeORM / Mongoose / Redis)
      entities/        # Modelos ORM (TypeORM), schemas (Mongoose), records (Redis)
      query-builders/  # Construcción de queries complejas / optimizadas
      connection/      # Configuración y pooling de conexiones
      transaction/     # Gestión de transacciones y rollback
      cache/           # Capa de caché con Redis
      schema/          # Runner que ejecuta los scripts SQL de esquema
      seeding/         # Población inicial / fixtures
    db/
      postgres/        # Scripts SQL (DDL) que crean los objetos de BD
```

### Flujo DDD por app

`Controller` → `Service (caso de uso)` → `puerto IXxxRepository` →
`XxxRepositoryImpl (infraestructura)` → repositorio base de `libs/repository`.

El dominio nunca conoce la tecnología de persistencia: el servicio depende del
puerto (inyectado vía token `XXX_REPOSITORY`) y la implementación concreta hace
el mapeo entidad-ORM ↔ agregado de dominio.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env        # ajusta credenciales de Postgres / Mongo / Redis

# crear objetos de BD (scripts SQL) y poblar datos (events / PostgreSQL)
pnpm db:init
pnpm seed

# desarrollo (una terminal por app)
pnpm start:events
pnpm start:incidents
pnpm start:alerts
```

Todas las apps exponen el prefijo global `/api` (p. ej. `GET http://localhost:3001/api/events`).

## Scripts útiles

| Script                       | Descripción                                  |
| ---------------------------- | -------------------------------------------- |
| `pnpm build`                 | Compila las tres apps                        |
| `pnpm build:<app>`           | Compila una app concreta                     |
| `pnpm start:<app>`           | Levanta una app en watch                     |
| `pnpm db:init`               | Crea los objetos de BD ejecutando los SQL    |
| `pnpm seed`                  | Pobla datos iniciales                        |
| `pnpm test` / `test:cov`     | Tests unitarios                              |
| `pnpm lint` / `format`       | ESLint / Prettier                            |
