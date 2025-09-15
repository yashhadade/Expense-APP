export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    shadow: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: "#f8f9fa",
    surface: "#ffffff",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    text: "#1a1a1a",
    textSecondary: "#64748b",
    textTertiary: "#94a3b8",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
    shadow: "#000000",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

export const darkTheme: Theme = {
  colors: {
    background: "#0f0f0f",
    surface: "#1a1a1a",
    primary: "#8b5cf6",
    secondary: "#a855f7",
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    textTertiary: "#71717a",
    border: "#27272a",
    borderLight: "#18181b",
    shadow: "#000000",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

export type ThemeMode = 'light' | 'dark';
