# Testing and quality

## Test strategy

The project uses a layered testing approach:

- **Unit tests:** Vitest for frontend and backend modules.
- **Static checks:** ESLint for frontend code quality and Node.js syntax validation for backend.
- **Manual testing:** End-to-end user flows executed across desktop and mobile viewports.

## Run tests

Backend:

```bash
cd backend
npm run test
npm run test:coverage
```

Frontend:

```bash
cd frontend
npm run test
npm run test:coverage
```

## Manual testing scope

The following areas are validated during release checks:

- Authentication flows (signup, login, logout)
- Chat creation and message delivery
- Image upload and profile updates
- Presence and online indicators
- Theme switching and persistence
- Responsive layout (mobile, tablet, desktop)

## Validation and quality gates

- **ESLint** enforces consistent React and hooks usage.
- **Vitest coverage** provides regression confidence for shared utilities and stores.
- **Node.js syntax validation** prevents runtime errors in backend modules.

## Performance checks

Lighthouse audits are run against the production build before release to validate performance, accessibility, and best practices. Results are recorded as part of the release checklist.

## Known limitations

- Performance tests are manual and not yet automated in CI.
- End-to-end tests are planned but not implemented.
