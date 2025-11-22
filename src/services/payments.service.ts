import { HttpClient } from '../http/http-client';
import { BusinessId } from '../types/common';
import { PaymentSTKRequest, VerifyPaymentRequest, PaymentResponse } from '../types/payments';

/**
 * Service for managing M-Pesa payments
 */
export class PaymentsService {
  constructor(private http: HttpClient) {}

  /**
   * Initiate M-Pesa STK Push payment for delivery packages
   * @param businessId - Business ID
   * @param data - Payment request with packages and phone number
   * @returns Payment response with success status and message
   * @throws {ValidationError} If validation fails or M-Pesa transaction failed
   * @throws {NotFoundError} If some packages not found or already paid
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const result = await client.payments.payWithSTK(505, {
   *   packages: [
   *     { id: 123, type: 'agent' },
   *     { id: 456, type: 'doorstep' }
   *   ],
   *   phone: '0712345678'
   * });
   * console.log(result.message); // "Payment initiated"
   * ```
   */
  async payWithSTK(businessId: BusinessId, data: PaymentSTKRequest): Promise<PaymentResponse> {
    return this.http.put<PaymentResponse>('/payment/pay-delivery-stk', data, {
      params: { b_id: businessId },
    });
  }

  /**
   * Verify and process a M-Pesa payment for delivery packages
   * @param businessId - Business ID
   * @param data - Verification request with packages and transaction code
   * @returns Payment response with success status and message
   * @throws {ValidationError} If validation fails or transaction issues
   * @throws {NotFoundError} If business or transaction not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const result = await client.payments.verifyPayment(505, {
   *   packages: [
   *     { id: 123, type: 'agent' },
   *     { id: 456, type: 'doorstep' }
   *   ],
   *   transcode: 'SH123XYZ789'
   * });
   * console.log(result.message); // "Payment verified"
   * ```
   */
  async verifyPayment(
    businessId: BusinessId,
    data: VerifyPaymentRequest
  ): Promise<PaymentResponse> {
    return this.http.put<PaymentResponse>('/payment/verify-payment', data, {
      params: { b_id: businessId },
    });
  }
}
