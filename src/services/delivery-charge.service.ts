import { HttpClient } from '../http/http-client';
import {
  DeliveryChargeResponse,
  AgentDeliveryChargeParams,
  DoorstepDeliveryChargeParams,
} from '../types/delivery-charge';

/**
 * Service for calculating delivery charges
 */
export class DeliveryChargeService {
  constructor(private http: HttpClient) {}

  /**
   * Get delivery fee for agent-to-agent package
   * @param params - Sender and receiver agent IDs
   * @returns Delivery charge information
   * @throws {ValidationError} If validation fails or zone pricing unavailable
   * @throws {NotFoundError} If sender or receiver agent not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const fee = await client.deliveryCharge.getAgentPackageFee({
   *   senderAgentID: 362,
   *   receiverAgentID: 454
   * });
   * console.log(fee.price); // e.g., 150
   * ```
   */
  async getAgentPackageFee(params: AgentDeliveryChargeParams): Promise<{ price: number }> {
    const response = await this.http.get<DeliveryChargeResponse>(
      '/delivery-charge/agent-package',
      params as unknown as Record<string, unknown>
    );
    return response.data;
  }

  /**
   * Get delivery fee for doorstep package
   * @param params - Sender agent ID and doorstep destination ID
   * @returns Delivery charge information
   * @throws {ValidationError} If validation fails or zone pricing unavailable
   * @throws {NotFoundError} If sender agent or doorstep destination not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const fee = await client.deliveryCharge.getDoorstepPackageFee({
   *   senderAgentID: 517,
   *   doorstepDestinationID: 541
   * });
   * console.log(fee.price); // e.g., 200
   * ```
   */
  async getDoorstepPackageFee(params: DoorstepDeliveryChargeParams): Promise<{ price: number }> {
    const response = await this.http.get<DeliveryChargeResponse>(
      '/delivery-charge/doorstep-package',
      params as unknown as Record<string, unknown>
    );
    return response.data;
  }
}
