type AppConfig = {
  VITE_API_BASE_URL?: string;
  VITE_WEB_SOCKET_URL?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig;
  }
}

const runtimeConfig = window.__APP_CONFIG__ || {};

const getConfigValue = (key: keyof AppConfig): string | undefined => {
  const runtimeValue = runtimeConfig[key]?.trim();

  if (runtimeValue) {
    return runtimeValue;
  }

  return import.meta.env[key]?.trim();
};

export const appConfig = {
  apiBaseUrl: getConfigValue('VITE_API_BASE_URL') || 'http://localhost:8000/api',
  webSocketUrl: getConfigValue('VITE_WEB_SOCKET_URL'),
};
