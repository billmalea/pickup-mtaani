import { AgentId, DoorstepDestinationId } from './common';

/**
 * Delivery charge response
 */
export interface DeliveryChargeResponse {
  data: {
    /**
     * Delivery price/fee
     */
    price: number;
  };
}

/**
 * Parameters for agent-to-agent delivery charge
 */
export interface AgentDeliveryChargeParams {
  /**
   * ID of the sender agent
   */
  senderAgentID: AgentId;
  /**
   * ID of the receiver agent
   */
  receiverAgentID: AgentId;
}

/**
 * Parameters for doorstep delivery charge
 */
export interface DoorstepDeliveryChargeParams {
  /**
   * ID of the sender agent
   */
  senderAgentID: AgentId;
  /**
   * ID of the doorstep destination
   */
  doorstepDestinationID: DoorstepDestinationId;
}
