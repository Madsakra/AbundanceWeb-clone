


function getApiEndpoint(): string {
    if (import.meta.env.MODE === 'production') {
      // In production, use the environment variable
      return import.meta.env.VITE_API_URL;
    } else {
      // In development, use a hardcoded URL or a different environment variable
      return 'http://127.0.0.1:8080';
    }
  }






export const api_endpoint = getApiEndpoint();

