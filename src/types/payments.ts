import { PackageId, KenyanPhoneNumber } from './common';

/**
 * Package reference for payments
 */
export interface PaymentPackage {
  id: PackageId;
  type: 'agent' | 'doorstep' | 'errand' | 'rent' | 'sale' | 'express';
}

/**
 * Request body for initiating M-Pesa STK Push payment
 */
export interface PaymentSTKRequest {
  packages: PaymentPackage[];
  phone: KenyanPhoneNumber;
}

/**
 * Request body for verifying M-Pesa payment
 */
export interface VerifyPaymentRequest {
  packages: PaymentPackage[];
  transcode: string;
}

/**
 * Payment response
 */
export interface PaymentResponse {
  success: boolean;
  message: string;
}
