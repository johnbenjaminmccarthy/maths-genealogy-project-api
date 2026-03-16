import type { GraphNeighboursResponse } from "../dto/api-v2/graph-neighbors.js";
import { type ResultSuccess, success } from "../types/result.js";

/**
 * A node in the Mathematics Genealogy Project graph.
 */
export type MgpGraphNode = {
  mgpId: string;
  parentNodeMgpIds: string[];
  childNodeMgpIds: string[];
};

/**
 * Converts a MGP graph node DTO to a graph node entity.
 *
 * @param params     - Parameters for the to graph node method.
 * @param params.dto - The MGP graph node DTO to convert.
 * @returns          A parse result containing the converted graph node entity.
 */
export function toMgpGraphNode(params: {
  dto: GraphNeighboursResponse;
}): ResultSuccess<MgpGraphNode> {
  const { dto } = params;

  const adviceFrom = dto.node_neighbors.adviceFrom;
  const adviceTo = dto.node_neighbors.adviceTo;

  /**
   * Checks if the node has parents.
   *
   * @param adviceFrom - The advice from list.
   * @returns          True if the node has parents, false otherwise.
   */
  function hasParents(
    adviceFrom: GraphNeighboursResponse["node_neighbors"]["adviceFrom"],
  ): adviceFrom is string[] {
    return !(adviceFrom.length === 1 && adviceFrom[0] === 0);
  }

  /**
   * Checks if the node has children.
   *
   * @param adviceTo - The advice to list.
   * @returns        True if the node has children, false otherwise.
   */
  function hasChildren(
    adviceTo: GraphNeighboursResponse["node_neighbors"]["adviceTo"],
  ): adviceTo is string[] {
    return !(adviceTo.length === 1 && adviceTo[0] === "");
  }

  const parentNodeMgpIds = hasParents(adviceFrom) ? adviceFrom : [];
  const childNodeMgpIds = hasChildren(adviceTo) ? adviceTo : [];

  return success({
    mgpId: dto.node_neighbors.ID,
    parentNodeMgpIds,
    childNodeMgpIds,
  });
}
