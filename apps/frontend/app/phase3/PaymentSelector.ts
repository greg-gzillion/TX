export interface PaymentState {
  method: string;
  status: 'pending' | 'confirmed' | 'failed';
}
