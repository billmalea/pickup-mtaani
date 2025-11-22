import { HttpClient } from '../http/http-client';
import { ApiResponse } from '../types/common';
import { Agent, AgentQueryParams } from '../types/agents';

/**
 * Service for managing agent operations
 */
export class AgentsService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieve a list of agents with optional filtering
   * @param params - Query parameters for filtering (locationId, searchKey)
   * @returns List of agents
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * // Get all agents
   * const agents = await client.agents.list();
   * 
   * // Filter by location
   * const agents = await client.agents.list({ locationId: 245 });
   * 
   * // Search by business name
   * const agents = await client.agents.list({ searchKey: 'kikuyu' });
   * ```
   */
  async list(params?: AgentQueryParams): Promise<Agent[]> {
    const response = await this.http.get<ApiResponse<Agent[]>>('/agents', params);
    return response.data || [];
  }
}
