# Changelog

## 1.0.0

Initial release of the MGP API client.

### Added

- `MgpClient` with methods for academics, search, graph, schools, siblings, and cohorts
- Paginated iteration via `getAllAcademics` with lazy `next()` pages
- Zod-validated response schemas for all endpoints
- `Result` and `Option` types for error handling without exceptions
- Subpath exports for `types`, `entities`, and `dto/api-v2`
- Unit tests for API response schema validation
- Integration test suite (skipped by default)
