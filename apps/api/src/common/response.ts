// Standard API response builders — used by ALL controllers, no exceptions.

export const success = (message: string, data: unknown = {}) => ({
  success: true,
  message,
  data,
});

export const failure = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors: errors ?? null,
});
