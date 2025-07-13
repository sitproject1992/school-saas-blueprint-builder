import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import UsersPage from './Users';
import { useUsers } from '@/hooks/useUsers';

vi.mock('@/hooks/useUsers', async () => {
  const actual = await vi.importActual('@/hooks/useUsers');
  return {
    ...actual,
    useUsers: vi.fn(() => ({
      data: [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'admin' },
        { id: '2', first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', role: 'teacher' },
      ],
      isLoading: false,
    })),
  };
});

describe('UsersPage', () => {
  it('renders the users page with a list of users', () => {
    renderWithProviders(<UsersPage />);

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
