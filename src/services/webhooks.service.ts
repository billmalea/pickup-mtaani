import { HttpClient } from '../http/http-client';
import { RegisterWebhookRequest, WebhookResponse } from '../types/webhooks';

/**
 * Service for managing webhooks
 */
export class WebhooksService {
  constructor(private http: HttpClient) {}

  /**
   * Register a webhook URL to receive real-time updates
   * @param data - Webhook URL to register
   * @returns Success message
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * await client.webhooks.register({
   *   webhook_url: 'https://yourdomain.com/webhooks/pickup-mtaani'
   * });
   *
   * // Your webhook endpoint should handle POST requests:
   * // POST /webhooks/pickup-mtaani
   * // Body: { event_type: 'package.state_changed', timestamp: ..., data: {...} }
   * ```
   */
  async register(data: RegisterWebhookRequest): Promise<string> {
    const response = await this.http.post<WebhookResponse>('/webhooks/register', data);
    return response.message || 'Webhook registered successfully';
  }
}
