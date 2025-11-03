/**
 * API Service Layer
 * Handles all communication with Django backend
 */

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API || 'http://127.0.0.1:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

interface NewsletterSubscription {
  email: string;
  name?: string;
  company?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error: ${endpoint}`, {
        status: response.status,
        data,
      });
      return {
        success: false,
        error: data.detail || data.error || 'An error occurred',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data,
      statusCode: response.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    console.error(`Fetch error: ${endpoint}`, error);
    return {
      success: false,
      error: errorMessage,
      statusCode: 0,
    };
  }
}

/**
 * Send contact message
 */
export async function sendContactMessage(
  message: ContactMessage
): Promise<ApiResponse<{ id: number; message: string }>> {
  return apiCall('/contact-message/', {
    method: 'POST',
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      phone: message.phone || '',
    }),
  });
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(
  subscription: NewsletterSubscription
): Promise<ApiResponse<{ email: string; subscribed: boolean }>> {
  return apiCall('/newsletter-subscribe/', {
    method: 'POST',
    body: JSON.stringify({
      email: subscription.email,
      name: subscription.name || '',
      company: subscription.company || '',
    }),
  });
}

/**
 * Get checkout session URL for plan
 */
export function getCheckoutUrl(plan: 'basic' | 'pro'): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
  return `${backendUrl}/api/checkout/?plan=${plan}`;
}

/**
 * Get platform stats
 */
export async function getPlatformStats() {
  return apiCall('/platform-stats/');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check API health
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health/`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get testimonials/reviews
 */
export async function getTestimonials() {
  return apiCall('/testimonials/');
}

/**
 * Get blog posts
 */
export async function getBlogPosts(limit?: number) {
  const url = limit ? `/blog/?limit=${limit}` : '/blog/';
  return apiCall(url);
}

/**
 * Get case studies
 */
export async function getCaseStudies() {
  return apiCall('/case-studies/');
}

/**
 * Get pricing information with dynamic values
 */
export async function getPricingInfo() {
  return apiCall('/pricing-info/');
}