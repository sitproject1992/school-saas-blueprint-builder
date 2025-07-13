import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { SchoolProvider } from '@/hooks/useSchool';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

import { SidebarProvider } from '@/components/ui/sidebar';

export function renderWithProviders(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SchoolProvider>
            <SidebarProvider>
              {ui}
            </SidebarProvider>
          </SchoolProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <BrowserRouter>
            <AuthProvider>
              <SchoolProvider>
                <SidebarProvider>
                  {rerenderUi}
                </SidebarProvider>
              </SchoolProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      ),
  };
}
