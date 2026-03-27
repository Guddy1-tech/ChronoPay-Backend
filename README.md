# chronopay-backend

API backend for **ChronoPay** — time tokenization and scheduling marketplace on Stellar.

## What's in this repo

- **Express** API with TypeScript
- Health and stub API routes (e.g. `/api/v1/slots`)
- Ready for Stellar Horizon integration, token service, and scheduling logic

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
# Clone the repo (or use your fork)
git clone <repo-url>
cd chronopay-backend

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Start dev server (with hot reload)
npm run dev

# Start production server
npm run start
```

## Scripts

| Script   | Description                    |
|----------|--------------------------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run production server         |
| `npm run dev`   | Run dev server with tsx watch  |
| `npm test`      | Run Jest tests                 |

## API (stub)

- `GET /health` — Health check; returns `{ status: "ok", service: "chronopay-backend" }`
- `GET /api/v1/slots` — List time slots (currently returns empty array)
- `POST /api/v1/slots` — Create a slot (RBAC-protected)

## RBAC (BE-020)

Role-based access control is enforced for protected endpoints using the request header:

- Header: `x-user-role`
- Supported roles: `admin`, `professional`, `customer`
- Current policy:
	- `POST /api/v1/slots`: allowed roles are `admin` and `professional`

### Failure Modes

- Missing role header: `401` with `Missing required authentication header: x-user-role`
- Invalid role value: `400` with `Invalid user role`
- Valid but unauthorized role: `403` with `Insufficient permissions`
- Middleware internal error: `500` with `Authorization middleware error`

### Security Notes

- Role checks are strict allow-list based, with no fallback/default role.
- Role input is normalized (`trim` + case-insensitive) before validation.
- Unauthorized access fails closed (request is rejected unless explicitly allowed).
- RBAC is middleware-based, so policy is explicit at route declaration.

### Acceptance Criteria

- Protected routes reject missing role headers.
- Protected routes reject unknown roles.
- Protected routes reject known but unauthorized roles.
- Allowed roles can access protected routes.
- Validation middleware remains active after authorization checks.
- Automated tests cover authorization and validation paths.

## Test Coverage (BE-020)

Run coverage report:
```bash
npm test -- --coverage
```

Current BE-020 coverage metrics:
- **RBAC middleware** (`src/middleware/rbac.ts`): **94.73%** statements, **100%** branches, **100%** functions
  - Missing: 1 line (catch block for defensive error handling)
- **Validation middleware** (`src/middleware/validation.ts`): 81.81% statements
- **Main entry** (`src/index.ts`): 88.23% statements

The RBAC catch block represents defensive programming—it catches unexpected exceptions during middleware execution, which is difficult to trigger in normal request flow. All authorization policy paths (authorized/unauthorized/invalid role) and validation scenarios are comprehensively covered by integration tests (24 tests, 3 test suites, all passing).

## Contributing

1. Fork the repo and create a branch from `main`.
2. Install deps and run tests: `npm install && npm test`.
3. Make changes; keep the build passing: `npm run build`.
4. Open a pull request. CI must pass (install, build, test).

## CI/CD

On every push and pull request to `main`, GitHub Actions runs:

- **Install**: `npm ci`
- **Build**: `npm run build`
- **Tests**: `npm test`

## License

MIT
