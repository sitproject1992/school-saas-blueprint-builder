import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to Skooler</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The all-in-one platform to manage your entire educational institution.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://github.com/your-repo/skooler" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Button>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Skooler Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
