export const ROUTES = {
  HOME: '/',
  CONFIG: '/config',
  SETTINGS: '/settings'
} as const;

export const ROUTE_LABELS = {
  [ROUTES.HOME]: 'Pomodoro Timer',
  [ROUTES.CONFIG]: 'Configuración',
  [ROUTES.SETTINGS]: 'Ajustes'
} as const; 