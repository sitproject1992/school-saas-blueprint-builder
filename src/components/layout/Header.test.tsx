import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { Header } from './Header';
import { useSchool } from '@/hooks/useSchool';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useSchool', async () => {
  const actual = await vi.importActual('@/hooks/useSchool');
  return {
    ...actual,
    useSchool: vi.fn(() => ({
      school: { id: '1', name: 'Test School' },
      schools: [{ id: '1', name: 'Test School' }],
      switchSchool: vi.fn(),
      isLoading: false,
    })),
  };
});

vi.mock('@/hooks/useAuth', async () => {
  const actual = await vi.importActual('@/hooks/useAuth');
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    })),
  };
});

describe('Header', () => {
  it('renders the header with the school switcher and user menu', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Test School')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test@example.com/i })).toBeInTheDocument();
  });
});
