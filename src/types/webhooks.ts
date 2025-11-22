import { PackageId, ISODateString } from './common';
import { PackageState } from './packages';

/**
 * Request body for registering a webhook URL
 */
export interface RegisterWebhookRequest {
  webhook_url: string;
}

/**
 * Response from webhook registration
 */
export interface WebhookResponse {
  message: string;
}

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'package.created'
  | 'package.updated'
  | 'package.state_changed'
  | 'package.delivered'
  | 'package.cancelled';

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  event_type: WebhookEventType;
  timestamp: number;
  data: {
    package_id: PackageId;
    package_type: 'agent' | 'doorstep' | 'express';
    receipt_no: string;
    state: PackageState;
    track_id: string;
    created_at?: ISODateString;
  };
}
