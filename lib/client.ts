import z from "zod";

import { mgpGraphEdgesResponseSchema } from "./dto/api-v2/graph-edges.js";
import { graphNeighboursResponseSchema } from "./dto/api-v2/graph-neighbors.js";
import { mgpAcademicResponseSchema } from "./dto/api-v2/mgp-academic.js";
import {
  schoolNamesByCountryResponseSchema,
  schoolNamesByIdResponseSchema,
} from "./dto/api-v2/school.js";
import { type Academic, toAcademic } from "./entities/academic.js";
import { type MgpGraph, toMgpGraph } from "./entities/graph.js";
import { type MgpGraphNode, toMgpGraphNode } from "./entities/node.js";
import {
  parseSchoolNameHtml,
  type SchoolName,
  type SchoolsByCountry,
  toSchoolDirectory,
  toSchoolsByCountry,
} from "./entities/school.js";
import type { HttpError, RangeRequestError, UnknownError, ValidationError } from "./types/error.js";
import { none, type Option, some } from "./types/option.js";
import type { PagedResult } from "./types/paged-result.js";
import type { RangeResult } from "./types/range-result.js";
import { failure, isFailure, isSuccess, type Result, success } from "./types/result.js";

/**
 * Constructor parameters for the MGP client.
 */
export interface MgpClientInitParams {
  /**
   * Your MGP v2 API key, obtainable by signing up for an account at {@link https://www.mathgenealogy.org:8000/api/v2/MGP/}.
   */
  apiKey: string;
  /**
   * Optional configuration for the MGP client.
   */
  options?: {
    /**
     * An override for the base URL of the MGP API.
     *
     * @default https://mathgenealogy.org:8000/api/v2/MGP/
     */
    baseUrl?: string;

    /**
     * An override for the fetch function to use.
     *
     * @default fetch
     */
    fetch?: (
      url: string | URL,
      options?: Pick<RequestInit, "method" | "headers">,
    ) => Promise<Response>;

    /**
     * An optional logger to use for info or debug logging.
     *
     * Does not provide logging by default.
     */
    logger?: typeof console | undefined;
  };
}

/**
 * A client for interacting with the MGP v2 API.
 */
export class MgpClient {
  private baseUrl = "https://mathgenealogy.org:8000/api/v2/MGP/";
  private readonly apiKey: string;
  private readonly logger?: typeof console | undefined;
  private readonly fetch: (
    url: string | URL,
    options?: Pick<RequestInit, "method" | "headers">,
  ) => Promise<Response>;

  /**
   * Constructor for the MGP client.
   *
   * @param initParams - Constructor parameters for the MGP client.
   */
  constructor(initParams: MgpClientInitParams) {
    this.apiKey = initParams.apiKey;
    this.baseUrl = initParams.options?.baseUrl ?? this.baseUrl;
    this.logger = initParams.options?.logger;
    this.fetch = initParams.options?.fetch ?? fetch;
  }

  /**
   * Performs a GET request to the MGP API and returns the raw `Response` object.
   *
   * @param params             - Parameters for the GET request.
   * @param params.path        - The path to the resource to GET.
   * @param params.queryParams - The query parameters to add to the request.
   * @returns                  A result containing the raw response.
   */
  private async get(params: {
    path: string;
    queryParams?: URLSearchParams;
  }): Promise<Result<Response, HttpError | UnknownError>> {
    const { path, queryParams } = params;

    const url = new URL(path, this.baseUrl);
    if (queryParams) {
      url.search = queryParams.toString();
    }

    this.logger?.debug(`GET ${url.toString()}`);

    const response: Result<Response, HttpError | UnknownError> = await this.fetch(url, {
      method: "GET",
      headers: [["X-Access-Token", this.apiKey]],
    })
      .then((response) => {
        return response.ok
          ? success(response)
          : failure<HttpError>({
              type: "http",
              statusCode: response.status.toString(),
              statusText: response.statusText,
            });
      })
      .catch((error: unknown) => {
        return failure<UnknownError>({ type: "unknown", cause: error });
      });

    if (isFailure(response)) {
      this.logger?.error(
        `Failed to get ${url.toString()}`,
        JSON.stringify(response.error, null, 2),
      );
    }

    return response;
  }

  /**
   * Performs a GET request to the MGP API and returns the response body parsed as JSON.
   *
   * @param params             - Parameters for the GET request.
   * @param params.path        - The path to the resource to GET.
   * @param params.queryParams - The query parameters to add to the request.
   * @returns                  A result containing the parsed JSON response body.
   */
  private async getJson(params: {
    path: string;
    queryParams?: URLSearchParams;
  }): Promise<Result<unknown, HttpError | UnknownError>> {
    const response = await this.get(params);

    if (isFailure(response)) {
      return response;
    }

    const body = await response.value
      .json()
      .then((json) => success(json))
      .catch((error: unknown) => failure<UnknownError>({ type: "unknown", cause: error }));

    this.logger?.debug("Raw response body", JSON.stringify(body, null, 2));

    return body;
  }

  /**
   * Performs a GET request to the MGP API and returns the response body as text.
   *
   * Used for endpoints that return non-JSON responses (e.g. HTML).
   *
   * @param params             - Parameters for the GET request.
   * @param params.path        - The path to the resource to GET.
   * @param params.queryParams - The query parameters to add to the request.
   * @returns                  A result containing the response text.
   */
  private async getText(params: {
    path: string;
    queryParams?: URLSearchParams;
  }): Promise<Result<string, HttpError | UnknownError>> {
    const response = await this.get(params);

    if (isFailure(response)) {
      return response;
    }

    const text = await response.value
      .text()
      .then((text) => success(text))
      .catch((error: unknown) => failure<UnknownError>({ type: "unknown", cause: error }));

    this.logger?.debug("Raw response body", text);

    return text;
  }

  /**
   * Validates a raw response body against a Zod Schema and returns a parse result containing the validated response.
   *
   * @param params                 - Parameters for the validate raw response body method.
   * @param params.rawResponseBody - The raw response body to validate.
   * @param params.dtoSchema       - The Zod Schema to validate the response against.
   * @returns                      A parse result containing the validated response.
   */
  private validateRawResponseBody<Dto>(params: {
    rawResponseBody: unknown;
    dtoSchema: z.ZodType<Dto>;
  }): Result<Dto, ValidationError> {
    const { rawResponseBody, dtoSchema } = params;

    const dtoResult = dtoSchema.safeParse(rawResponseBody);

    this.logger?.debug("DTO result", JSON.stringify(dtoResult, null, 2));

    return dtoResult.success
      ? success(dtoResult.data)
      : failure<ValidationError>({ type: "validation", details: dtoResult.error });
  }

  /**
   * Get an academic by their MGP ID.
   *
   * @param id - The MGP ID of the academic to get.
   * @returns  An academic by their MGP ID.
   */
  public async getAcademicById(
    id: string,
  ): Promise<Result<Option<Academic>, HttpError | UnknownError | ValidationError>> {
    const response = await this.getJson({
      path: `acad`,
      queryParams: new URLSearchParams({ id }),
    });

    // MGP API returns a 502 Bad Gateway error when the academic requested does not exist.
    if (
      isFailure(response) &&
      response.error.type === "http" &&
      response.error.statusCode === "502"
    ) {
      this.logger?.info(`Academic with ID ${id} not found`);

      return success(none);
    } else if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: mgpAcademicResponseSchema,
    });

    if (isSuccess(dtoResult)) {
      const academic = toAcademic({ dto: dtoResult.value }).value;

      return success(some(academic));
    } else {
      return dtoResult;
    }
  }

  /**
   * Get all academic IDs.
   *
   * @returns All academic IDs.
   */
  public async getAllAcademicIds(): Promise<
    Result<string[], HttpError | UnknownError | ValidationError>
  > {
    const response = await this.getJson({
      path: `acad/all`,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: z.array(z.number()),
    });

    if (isSuccess(dtoResult)) {
      return success(dtoResult.value.map((id) => id.toString()));
    } else {
      return dtoResult;
    }
  }

  /**
   * Returns all MGP academics in a range from `startMgpId` to `endMgpId` (exclusive).
   *
   * The range is capped at 10,000 IDs. Due to gaps in the MGP ID sequence, the actual number
   * of returned academics may be less than the range size.
   *
   * @param params            - Parameters for the get academics in range method.
   * @param params.startMgpId - The start MGP ID of the range (inclusive).
   * @param params.endMgpId   - The end MGP ID of the range (exclusive).
   * @returns                 A range result containing the academics in the range.
   */
  public async getAcademicsInRange(params: {
    /**
     * The start MGP ID of the range (inclusive).
     */
    startMgpId: number;
    /**
     * The end MGP ID of the range (exclusive).
     */
    endMgpId: number;
  }): Promise<
    Result<RangeResult<Academic>, HttpError | UnknownError | ValidationError | RangeRequestError>
  > {
    const { startMgpId, endMgpId } = params;

    // Validate the starting MGP ID
    if (startMgpId < 0) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "Starting MGP ID must be greater than or equal to 0",
      });
    }

    // Validate the end MGP ID
    if (endMgpId <= startMgpId) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "End MGP ID must be greater than the start MGP ID",
      });
    }

    // Enforce the hard 10,000 limit
    if (endMgpId - startMgpId > 10_000) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "Range must not exceed 10,000 IDs",
      });
    }

    const response = await this.getJson({
      path: `acad/range`,
      queryParams: new URLSearchParams({
        start: startMgpId.toString(),
        stop: endMgpId.toString(),
        step: "1",
      }),
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: z.array(mgpAcademicResponseSchema),
    });

    if (isSuccess(dtoResult)) {
      const academics = dtoResult.value.map((academic) => toAcademic({ dto: academic }).value);

      return success({
        startMgpId,
        endMgpId,
        numberOfResults: academics.length,
        results: academics,
      });
    } else {
      return dtoResult;
    }
  }

  /**
   * Fetches all MGP academics using paginated range requests.
   *
   * Returns a page of results with a `next()` method to fetch the subsequent page,
   * giving consumers control over the rate at which the API is called.
   *
   * @param params            - Parameters for the get all academics method.
   * @param params.startMgpId - The MGP ID to start fetching from (inclusive).
   * @param params.pageSize   - The number of IDs to fetch per page (1–10,000).
   * @returns                 The first page of results.
   */
  public async getAllAcademics(params: {
    /**
     * The MGP ID to start fetching from (inclusive).
     *
     * @default 0
     */
    startMgpId?: number;
    /**
     * The number of IDs to fetch per page (1–10,000).
     *
     * @default 100
     */
    pageSize?: number;
  }): Promise<
    Result<PagedResult<Academic>, HttpError | UnknownError | ValidationError | RangeRequestError>
  > {
    const { startMgpId = 0, pageSize = 100 } = params;

    // Validate the page size
    if (pageSize < 1) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "Page size must be greater than or equal to 1",
      });
    }

    if (pageSize > 10_000) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "Page size must not exceed 10,000",
      });
    }

    // Validate the starting MGP ID
    if (startMgpId < 0) {
      return failure<RangeRequestError>({
        type: "range-request",
        message: "Starting MGP ID must be greater than or equal to 0",
      });
    }

    return this.fetchPage({ startMgpId, pageSize });
  }

  /**
   * Fetches a single page of academics and returns a `PagedResult` with a `next()` continuation.
   *
   * @param params            - Parameters for the fetch page method.
   * @param params.startMgpId - The MGP ID to start fetching from (inclusive).
   * @param params.pageSize   - The number of IDs to fetch per page.
   * @returns                 A page of results with a `next()` method.
   */
  private async fetchPage(params: {
    startMgpId: number;
    pageSize: number;
  }): Promise<
    Result<PagedResult<Academic>, HttpError | UnknownError | ValidationError | RangeRequestError>
  > {
    const { startMgpId, pageSize } = params;
    const endMgpId = startMgpId + pageSize;

    const rangeResult = await this.getAcademicsInRange({ startMgpId, endMgpId });

    if (isFailure(rangeResult)) {
      return rangeResult;
    }

    const { results, numberOfResults } = rangeResult.value;
    const hasNextPage = numberOfResults > 0;

    return success({
      startMgpId,
      endMgpId,
      numberOfResults,
      results,
      hasNextPage,
      next: () => this.fetchPage({ startMgpId: endMgpId, pageSize }),
    });
  }

  /**
   * Search for academics by various filters.
   *
   * Do not use too many filters or you are unlikely to get any results.
   *
   * @param params                           - Parameters for the search academics method.
   * @param params.filters                   - Filters to apply to the search.
   * @param params.filters.familyName        - The family name of the academic to search for.
   * @param params.filters.givenName         - The given name of the academic to search for.
   * @param params.filters.otherNames        - The other names of the academic to search for.
   * @param params.filters.schoolName        - The school name of the academic to search for.
   * @param params.filters.degreeYear        - The degree year of the academic to search for.
   * @param params.filters.thesisTitle       - The thesis title of the academic to search for.
   * @param params.filters.country           - The country of the academic to search for.
   * @param params.filters.mscClassification - The MSC classification of the academic to search for.
   * @returns                                A result containing the academic IDs matching the filters.
   */
  public async searchAcademics(params: {
    filters: {
      familyName?: string;
      givenName?: string;
      otherNames?: string;
      schoolName?: string;
      degreeYear?: string;
      thesisTitle?: string;
      country?: string;
      mscClassification?: string;
    };
  }): Promise<Result<{ mgpId: string }[], HttpError | UnknownError | ValidationError>> {
    const { filters } = params;

    const searchParams = new URLSearchParams();
    if (filters.familyName) {
      searchParams.set("family_name", filters.familyName);
    }
    if (filters.givenName) {
      searchParams.set("given_name", filters.givenName);
    }
    if (filters.otherNames) {
      searchParams.set("other_names", filters.otherNames);
    }
    if (filters.schoolName) {
      searchParams.set("school", filters.schoolName);
    }
    if (filters.degreeYear) {
      searchParams.set("year", filters.degreeYear);
    }
    if (filters.thesisTitle) {
      searchParams.set("thesis", filters.thesisTitle);
    }
    if (filters.country) {
      searchParams.set("country", filters.country);
    }
    if (filters.mscClassification) {
      searchParams.set("msc", filters.mscClassification);
    }

    const response = await this.getJson({
      path: `search`,
      queryParams: searchParams,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: z.array(z.number()),
    });

    if (isSuccess(dtoResult)) {
      return success(dtoResult.value.map((id) => ({ mgpId: id.toString() })));
    } else {
      return dtoResult;
    }
  }

  /**
   * Get the graph node for a given MGP ID.
   *
   * @param id - The MGP ID of the node to get the graph node for.
   * @returns  The graph node for the given MGP ID.
   */
  public async getGraphNode(
    id: string,
  ): Promise<Result<Option<MgpGraphNode>, HttpError | UnknownError | ValidationError>> {
    const response = await this.getJson({
      path: `graph/neighbors`,
      queryParams: new URLSearchParams({ id }),
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: graphNeighboursResponseSchema,
    });

    if (isSuccess(dtoResult)) {
      const graphNode = toMgpGraphNode({ dto: dtoResult.value }).value;

      return success(some(graphNode));
    } else {
      return dtoResult;
    }
  }

  /**
   * Fetches the entire Mathematics Genealogy Project graph.
   *
   * @returns The entire Mathematics Genealogy Project graph.
   */
  public async getGraph(): Promise<Result<MgpGraph, HttpError | UnknownError | ValidationError>> {
    const response = await this.getJson({
      path: `graph/edges`,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: mgpGraphEdgesResponseSchema,
    });

    if (isSuccess(dtoResult)) {
      const graph = toMgpGraph({ dto: dtoResult.value }).value;

      return success(graph);
    } else {
      return dtoResult;
    }
  }

  /**
   * Get a school name by its school ID.
   *
   * @param schoolId - The school ID to get the name for.
   * @returns        The school name for the given school ID, or none if the school does not exist.
   */
  public async getSchoolNameById(
    schoolId: string,
  ): Promise<Result<Option<SchoolName>, HttpError | UnknownError>> {
    const response = await this.getText({
      path: `schoolname_from_id/`,
      queryParams: new URLSearchParams({ school_id: schoolId }),
    });

    if (isFailure(response)) {
      return response;
    }

    const schoolName = parseSchoolNameHtml(response.value);

    if (schoolName === null) {
      this.logger?.info(`School with ID ${schoolId} not found`);

      return success(none);
    }

    return success(some(schoolName));
  }

  /**
   * Get all school names organised by school ID.
   *
   * @returns All school names indexed by their school ID.
   */
  public async getAllSchoolNamesById(): Promise<
    Result<SchoolName[], HttpError | UnknownError | ValidationError>
  > {
    const response = await this.getJson({
      path: `schoolnames_by_id/`,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: schoolNamesByIdResponseSchema,
    });

    if (isSuccess(dtoResult)) {
      return success(toSchoolDirectory({ dto: dtoResult.value }).value);
    } else {
      return dtoResult;
    }
  }

  /**
   * Get all school names organised by country.
   *
   * @returns All school names grouped by country.
   */
  public async getSchoolNamesByCountry(): Promise<
    Result<SchoolsByCountry[], HttpError | UnknownError | ValidationError>
  > {
    const response = await this.getJson({
      path: `schoolnames_by_country/`,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: schoolNamesByCountryResponseSchema,
    });

    if (isSuccess(dtoResult)) {
      return success(toSchoolsByCountry({ dto: dtoResult.value }).value);
    } else {
      return dtoResult;
    }
  }

  /**
   * Get the academic siblings of a mathematician.
   *
   * Siblings are academics who share a common advisor and earned a degree from the same university.
   *
   * @param id             - The MGP ID of the mathematician to get siblings for.
   * @param options        - Optional parameters.
   * @param options.window - The year range window to filter siblings by.
   * @returns              The list of sibling academics.
   */
  public async getSiblings(
    id: string,
    options?: { window?: number },
  ): Promise<Result<Academic[], HttpError | UnknownError | ValidationError>> {
    const queryParams = new URLSearchParams({ id, format: "json" });
    if (options?.window !== undefined) {
      queryParams.set("window", options.window.toString());
    }

    const response = await this.getJson({
      path: `siblings`,
      queryParams,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: z.array(mgpAcademicResponseSchema),
    });

    if (isSuccess(dtoResult)) {
      const academics = dtoResult.value.map((academic) => toAcademic({ dto: academic }).value);

      return success(academics);
    } else {
      return dtoResult;
    }
  }

  /**
   * Get the academic cohort of a mathematician.
   *
   * A cohort includes academics who earned degrees from the same university within
   * the specified year window on either side of the query mathematician's graduation date.
   *
   * @param id             - The MGP ID of the mathematician to get the cohort for.
   * @param options        - Optional parameters.
   * @param options.window - The year range window to filter the cohort by (defaults to 2 on the API side).
   * @returns              The list of cohort academics.
   */
  public async getCohort(
    id: string,
    options?: { window?: number },
  ): Promise<Result<Academic[], HttpError | UnknownError | ValidationError>> {
    const queryParams = new URLSearchParams({ id, format: "json" });
    if (options?.window !== undefined) {
      queryParams.set("window", options.window.toString());
    }

    const response = await this.getJson({
      path: `cohort`,
      queryParams,
    });

    if (isFailure(response)) {
      return response;
    }

    const dtoResult = this.validateRawResponseBody({
      rawResponseBody: response.value,
      dtoSchema: z.array(mgpAcademicResponseSchema),
    });

    if (isSuccess(dtoResult)) {
      const academics = dtoResult.value.map((academic) => toAcademic({ dto: academic }).value);

      return success(academics);
    } else {
      return dtoResult;
    }
  }
}
