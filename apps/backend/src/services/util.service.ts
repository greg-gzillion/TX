

export class UtilService {
  // Generate unique IDs
  static generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}${timestamp}${random}`.toUpperCase();
  }

  // Format currency
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  }

  // Format date
  static formatDate(date: Date, format: string = 'medium'): string {
    const options: Intl.DateTimeFormatOptions =
      format === 'short' ? { dateStyle: 'short', timeStyle: 'short' } :
      format === 'long' ? { dateStyle: 'long', timeStyle: 'long' } :
      { dateStyle: 'medium', timeStyle: 'medium' };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  // Generate random string
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validate email
  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Delay function
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sanitize input
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Calculate percentage
  static calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }
}

export default UtilService;
