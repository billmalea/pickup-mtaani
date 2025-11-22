import { BusinessId, CategoryId, KenyanPhoneNumber, ISODateString } from './common';

/**
 * Business entity
 */
export interface Business {
  /**
   * Unique identifier for the business
   */
  id: BusinessId;
  /**
   * Business name
   */
  name: string;
  /**
   * Business phone number (Kenyan format)
   */
  phone_number: KenyanPhoneNumber;
  /**
   * Date and time the business was created
   */
  createdAt: ISODateString;
}

/**
 * Business category
 */
export interface BusinessCategory {
  /**
   * Category ID
   */
  id: CategoryId;
  /**
   * Category name
   */
  name: string;
}

/**
 * Request body for updating business
 */
export interface UpdateBusinessRequest {
  /**
   * New business name
   */
  name?: string;
  /**
   * New phone number (must match Kenyan format: /^(\+254|0)(1|7)[0-9]{8}$/)
   */
  phone_number?: KenyanPhoneNumber;
  /**
   * New category ID
   */
  category_id?: CategoryId;
}
