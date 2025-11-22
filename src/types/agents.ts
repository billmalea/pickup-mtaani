import { AgentId, LocationId } from './common';

/**
 * Agent entity
 */
export interface Agent {
  /**
   * Agent ID
   */
  id: AgentId;
  /**
   * Business name of the agent
   */
  business_name: string;
}

/**
 * Query parameters for agents endpoint
 */
export interface AgentQueryParams {
  /**
   * Filter agents by location ID
   */
  locationId?: LocationId;
  /**
   * Search key to filter agents by business name
   */
  searchKey?: string;
}
