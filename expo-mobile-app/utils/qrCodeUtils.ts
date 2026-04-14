// Utility functions for customer QR code generation and parsing

export interface CustomerData {
  name: string;
  village: string;
  phone: string;
  id?: string;
}

/**
 * Generate QR code data from customer information
 * Returns a JSON string that can be encoded as QR code
 */
export function generateCustomerQRData(customer: CustomerData): string {
  return JSON.stringify({
    type: 'customer',
    name: customer.name,
    village: customer.village,
    phone: customer.phone,
    id: customer.id || Math.random().toString(36).substr(2, 9),
    generatedAt: new Date().toISOString(),
  });
}

/**
 * Parse QR code data and extract customer information
 */
export function parseCustomerQRData(qrData: string): CustomerData | null {
  try {
    const data = JSON.parse(qrData);
    if (data.type === 'customer' && data.name && data.village && data.phone) {
      return {
        name: data.name,
        village: data.village,
        phone: data.phone,
        id: data.id,
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
}

/**
 * Format customer data as a readable string
 */
export function formatCustomerQRText(customer: CustomerData): string {
  return `Name: ${customer.name}\nVillage: ${customer.village}\nPhone: ${customer.phone}`;
}

/**
 * Get QR code generation URL (can be used with Google Charts API)
 */
export function getQRCodeImageUrl(data: string, size: number = 200): string {
  const encoded = encodeURIComponent(data);
  return `https://chart.googleapis.com/chart?chs=${size}x${size}&chd=D:${data}&cht=qr`;
}
