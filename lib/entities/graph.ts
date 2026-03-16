import type { MgpGraphEdgesResponse } from "../dto/api-v2/graph-edges.js";
import { type ResultSuccess, success } from "../types/result.js";

/**
 * A directed edge in the Mathematics Genealogy Project graph.
 */
export type MgpGraphEdge = {
  fromMgpId: string;
  toMgpId: string;
};

/**
 * A graph entity in the Mathematics Genealogy Project.
 */
export type MgpGraph = {
  /**
   * The number of nodes in the graph, as reported by the MGP API.
   */
  numberOfNodes: number;
  /**
   * The number of edges in the graph, as reported by the MGP API.
   */
  numberOfEdges: number;

  /**
   * A list of directed edges in the graph, as reported by the MGP API.
   */
  directedEdges: MgpGraphEdge[];
};

/**
 * Converts a MGP graph edges DTO to a graph entity.
 *
 * @param params     - Parameters for the to graph method.
 * @param params.dto - The MGP graph edges DTO to convert.
 * @returns          A parse result containing the converted graph entity.
 */
export function toMgpGraph(params: { dto: MgpGraphEdgesResponse }): ResultSuccess<MgpGraph> {
  const { dto } = params;

  const directedEdges = dto.directed_edges.map(([fromMgpId, toMgpId]) => ({
    fromMgpId: fromMgpId.toString(),
    toMgpId: toMgpId.toString(),
  }));

  return success({
    numberOfNodes: dto.number_of_nodes,
    numberOfEdges: dto.number_of_edges,
    directedEdges,
  });
}
