/**
 * A custom fetch wrapper that acts like Axios.
 * It automatically handles JSON parsing, throwing errors for non-2xx responses,
 * and setting default headers (like Content-Type).
 */

interface FetchOptions extends RequestInit {
  data?: any; // For passing body as an object
  params?: Record<string, string>; // For URL search params
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function apiClient<T>(endpoint: string, { data, params, ...customConfig }: FetchOptions = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  // Handle URL params
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Prepend /api if it's a relative path and doesn't already have it
  if (!url.startsWith('http') && !url.startsWith('/api')) {
      url = `/api${url.startsWith('/') ? url : `/${url}`}`;
  }

  const response = await fetch(url, config);

  // If the response is not ok, throw an ApiError
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData.error || response.statusText, errorData);
  }

  // If response is 204 No Content, return empty object
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Convenience methods similar to axios
apiClient.get = <T>(url: string, params?: Record<string, string>, config?: FetchOptions) => 
  apiClient<T>(url, { method: "GET", params, ...config });

apiClient.post = <T>(url: string, data?: any, config?: FetchOptions) => 
  apiClient<T>(url, { method: "POST", data, ...config });

apiClient.put = <T>(url: string, data?: any, config?: FetchOptions) => 
  apiClient<T>(url, { method: "PUT", data, ...config });

apiClient.patch = <T>(url: string, data?: any, config?: FetchOptions) => 
  apiClient<T>(url, { method: "PATCH", data, ...config });

apiClient.delete = <T>(url: string, config?: FetchOptions) => 
  apiClient<T>(url, { method: "DELETE", ...config });

export { apiClient };
