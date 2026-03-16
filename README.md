# Maths Genealogy Project API

[![CI](https://github.com/johnbenjaminmccarthy/maths-genealogy-project-api/actions/workflows/ci.yml/badge.svg)](https://github.com/johnbenjaminmccarthy/maths-genealogy-project-api/actions/workflows/ci.yml)

This package is a Node wrapper over the
[Maths Genealogy Project API](https://www.mathgenealogy.org:8000/api/v2/MGP/).

It provides convenience methods for most of the common operations one would want to do with the API,
and provides clean, validated response types for all endpoints.

> **⚠️ Note**  
> This package is **not affiliated** with the official Mathematics Genealogy Project or its
> maintainers.  
> Please respect the API usage limits and
> [terms of service](https://www.mathgenealogy.org:8000/api/v2/MGP/).  
> This library simply provides a typed, ergonomic client for the public API.

## Getting Started

Add the package:

```bash
pnpm add maths-genealogy-project-api
```

To use the package, import and instantiate a client:

```ts
import { MgpClient } from "maths-genealogy-project-api";

const mgpClient = new MgpClient({ apiKey: "<your_api_key_here>" });
```

To source an API key, visit
[the MGP API documentation page and sign up](https://www.mathgenealogy.org:8000/api/v2/MGP/).

> **⚠️ Note**  
> An MGP API key only lasts for 2 hours. This package is intended to be used as a convenience
> wrapper around short, deliberate API access, and does not facilitate extended usage beyond the
> limits imposed by the MGP.

## Documentation

The `MgpClient` provides a convenient interface for interacting with the MGP API. All requests are
strictly validated using [Zod](https://zod.dev/).

The `MgpClient` uses option and result types for responses, and does not throw errors. Check
`result.ok` to determine if a method call resulted in a successful request, and
`option.kind === "some"` to determine if a get request returned a result.

### Methods

The `MgpClient` has the following methods for interacting with the API:

| Method                                          | Raw MGP path                                     | Request parameters                                                                                                                | Expected response                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAcademicById(id)`                           | `acad?id={id}`                                   | **Path**: `acad` **Query**: `id` (string MGP ID)                                                                                  | `Result<Option<Academic>, HttpError \| UnknownError \| ValidationError>` — `Some` with a single academic or `None` if not found (502 translated to `None`)            |
| `getAllAcademicIds()`                           | `acad/all`                                       | **Path**: `acad/all`                                                                                                              | `Result<string[], HttpError \| UnknownError \| ValidationError>` — all known academic IDs as strings                                                                  |
| `getAcademicsInRange({ startMgpId, endMgpId })` | `acad/range?start={start}&stop={end}&step=1`     | **Path**: `acad/range` **Query**: `start` (number, default `0`), `stop` (number, exclusive upper bound), `step=1`                 | `Result<RangeResult<Academic>, HttpError \| UnknownError \| ValidationError \| RangeRequestError>` — academics in the requested ID range (max span 10,000)            |
| `getAllAcademics({ startMgpId?, pageSize? })`   | Uses repeated `acad/range` calls under the hood  | **Path**: `acad/range` (internal) **Query**: derived `start`, `stop`, `step=1` per page                                           | `Result<PagedResult<Academic>, HttpError \| UnknownError \| ValidationError \| RangeRequestError>` — first page plus `next()` to lazily fetch subsequent pages        |
| `searchAcademics({ filters })`                  | `search?...`                                     | **Path**: `search` **Query (optional)**: `family_name`, `given_name`, `other_names`, `school`, `year`, `thesis`, `country`, `msc` | `Result<{ mgpId: string }[], HttpError \| UnknownError \| ValidationError>` — list of matching academic IDs                                                           |
| `getGraphNode(id)`                              | `graph/neighbors?id={id}`                        | **Path**: `graph/neighbors` **Query**: `id` (string MGP ID)                                                                       | `Result<Option<MgpGraphNode>, HttpError \| UnknownError \| ValidationError>` — ego‑network (neighbors) for the given ID, or `None` if missing                         |
| `getGraph()`                                    | `graph/edges`                                    | **Path**: `graph/edges`                                                                                                           | `Result<MgpGraph, HttpError \| UnknownError \| ValidationError>` — full Mathematics Genealogy Project graph (nodes and edges)                                         |
| `getSchoolNameById(schoolId)`                   | `schoolname_from_id/?school_id={schoolId}`       | **Path**: `schoolname_from_id/` **Query**: `school_id` (string)                                                                   | `Result<Option<SchoolName>, HttpError \| UnknownError>` — parsed school name for the given ID, or `None` if not found                                                 |
| `getAllSchoolNamesById()`                       | `schoolnames_by_id/`                             | **Path**: `schoolnames_by_id/`                                                                                                    | `Result<SchoolName[], HttpError \| UnknownError \| ValidationError>` — all school names indexed by internal ID                                                        |
| `getSchoolNamesByCountry()`                     | `schoolnames_by_country/`                        | **Path**: `schoolnames_by_country/`                                                                                               | `Result<SchoolsByCountry[], HttpError \| UnknownError \| ValidationError>` — schools grouped by country                                                               |
| `getSiblings(id, options?)`                     | `siblings?id={id}&format=json[&window={window}]` | **Path**: `siblings` **Query**: `id` (string MGP ID), `format=json`, optional `window` (number year window)                       | `Result<Academic[], HttpError \| UnknownError \| ValidationError>` — sibling academics sharing advisors and university, optionally filtered by graduation year window |
| `getCohort(id, options?)`                       | `cohort?id={id}&format=json[&window={window}]`   | **Path**: `cohort` **Query**: `id` (string MGP ID), `format=json`, optional `window` (number year window)                         | `Result<Academic[], HttpError \| UnknownError \| ValidationError>` — cohort academics from the same university within the specified year window                       |

## Package structure

This is a `pnpm` package which uses `eslint` for linting, `prettier` for formatting, and `vitest`
for tests.

To begin, run

```
pnpm install
```

For type checking, linting, checking formatting, and testing, run

```sh
pnpm typecheck
pnpm lint #pnpm lint:fix to fix auto-fixable linting errors
pnpm format #pnpm format:fix to fix auto-fixable formatting errors
pnpm test
```

or

```sh
pnpm check
```

to do all four.

### Tests

Test data derived from the MGP API is used for schema validation tests of raw API responses, found
in `test/assets`.

A suite of integration tests are available to test the functionality of the package against the real
MGP API. By default all integration tests are marked as `.skip` for politeness.

To run integration tests, add your MGP API key to a `.env` file following the `.env.template`,
delete the `.skip` on any particular integration test you wish to run, and run
`pnpm test:integration`.
