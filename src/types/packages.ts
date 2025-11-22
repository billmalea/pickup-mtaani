import {
  PackageId,
  BusinessId,
  AgentId,
  DoorstepDestinationId,
  KenyanPhoneNumber,
  ISODateString,
  Coordinate,
  PaginationParams,
  RiderTypeId,
} from './common';

/**
 * Package state/status
 */
export type PackageState = 'request' | 'in_transit' | 'delivered' | 'cancelled' | 'pending';

/**
 * Payment options for packages
 */
export type PaymentOption = 'vendor' | 'collection' | 'customer';

/**
 * Package tracking event
 */
export interface PackageTrackEvent {
  /**
   * Timestamp of the event
   */
  time: number;
  /**
   * Package state at this event
   */
  state: PackageState;
  /**
   * Description of the event
   */
  descriptions: string;
  /**
   * ISO date string of when event was created
   */
  createdAt?: ISODateString;
}

/**
 * Base package properties shared across all package types
 */
export interface BasePackage {
  id: PackageId;
  createdAt: ISODateString;
  customerName: string;
  customerPhoneNumber: KenyanPhoneNumber;
  packageName: string;
  packageValue?: number;
  receipt_no: string;
  state: PackageState;
  delivery_fee: number;
  payment_option: PaymentOption;
  on_delivery_balance?: number;
  trackId: string;
  businessId_id: BusinessId;
}

/**
 * Agent-to-agent package
 */
export interface AgentPackage extends BasePackage {
  type: 'agent';
  senderAgentID_id: AgentId;
  receieverAgentID_id: AgentId;
  agent_package_tracks?: {
    descriptions: PackageTrackEvent[];
  };
}

/**
 * Request body for creating an agent package
 */
export interface CreateAgentPackageRequest {
  receiverAgentId: AgentId;
  senderAgentId: AgentId;
  packageValue: number;
  customerName: string;
  packageName: string;
  customerPhoneNumber: KenyanPhoneNumber;
  paymentOption: 'vendor';
  on_delivery_balance?: number;
}

/**
 * Request body for updating an agent package
 */
export interface UpdateAgentPackageRequest {
  receiverAgentId?: AgentId;
  senderAgentId?: AgentId;
  packageValue?: number;
  customerName?: string;
  packageName?: string;
  customerPhoneNumber?: KenyanPhoneNumber;
  paymentOption?: 'vendor';
  on_delivery_balance?: number;
}

/**
 * Doorstep delivery package
 */
export interface DoorstepPackage extends BasePackage {
  type: 'doorstep';
  agent_id: AgentId;
  doorstepDestinationId?: DoorstepDestinationId;
  locationDescription?: string;
  lat?: number;
  lng?: number;
  door_step_package_tracks?: {
    descriptions: PackageTrackEvent[];
  };
}

/**
 * Request body for creating a doorstep package
 */
export interface CreateDoorstepPackageRequest {
  senderAgentID_id: AgentId;
  packageValue: number;
  customerName: string;
  packageName: string;
  customerPhoneNumber: KenyanPhoneNumber;
  paymentOption: 'vendor';
  on_delivery_balance?: number;
  doorstepDestinationId: DoorstepDestinationId;
  locationDescription?: string;
  lat?: number;
  lng?: number;
}

/**
 * Request body for updating a doorstep package
 */
export interface UpdateDoorstepPackageRequest {
  senderAgentId?: AgentId;
  packageValue?: number;
  customerName?: string;
  packageName?: string;
  customerPhoneNumber?: KenyanPhoneNumber;
  paymentOption?: 'vendor';
  on_delivery_balance?: number;
  doorstepDestinationId?: DoorstepDestinationId;
  locationDescription?: string;
  lat?: number;
  lng?: number;
}

/**
 * Express delivery package
 */
export interface ExpressPackage extends BasePackage {
  type: 'express';
  depart_point: Coordinate;
  destination: Coordinate;
  exact_location: string;
  from?: string;
  to?: string;
  payment_status: string;
  business: {
    id: BusinessId;
    name: string;
  };
}

/**
 * Request body for creating an express package
 */
export interface CreateExpressPackageRequest {
  customer_name: string;
  customer_phone_number: KenyanPhoneNumber;
  package_value: number;
  package_name: string;
  departure: Coordinate;
  destination: Coordinate;
  exact_location: string;
  payment_option: PaymentOption;
  on_delivery_balance?: number;
  from?: string;
  to?: string;
}

/**
 * Request body for updating an express package
 */
export interface UpdateExpressPackageRequest {
  departure?: Coordinate;
  destination?: Coordinate;
  customer_name?: string;
  package_name?: string;
  exact_location?: string;
  from?: string;
  to?: string;
  customer_phone_number?: KenyanPhoneNumber;
  package_value?: number;
  payment_option?: PaymentOption;
  on_delivery_balance?: number;
  rider_type_id?: RiderTypeId;
}

/**
 * Request for getting express delivery directions and pricing
 */
export interface ExpressDirectionsRequest {
  coordinates: Coordinate[];
  rider_type_id: RiderTypeId;
}

/**
 * Response with delivery directions and pricing
 */
export interface ExpressDirectionsResponse {
  distance: number;
  duration: number;
  price: number;
  gross_price: number;
}

/**
 * Delivery mode (bike, car, etc.)
 */
export interface DeliveryMode {
  id: RiderTypeId;
  name: string;
  description: string;
}

/**
 * Nearby rider information
 */
export interface NearbyRider {
  rider_id: number;
  loc: Coordinate;
  name: string;
  email: string;
  phone_number: string;
}

/**
 * Query parameters for listing packages
 */
export interface PackageQueryParams extends PaginationParams {
  state?: PackageState;
  receipt_no?: string;
  phoneNumber?: KenyanPhoneNumber;
  customerName?: string;
  id?: PackageId;
}

/**
 * Union type for all package types
 */
export type Package = AgentPackage | DoorstepPackage | ExpressPackage;
