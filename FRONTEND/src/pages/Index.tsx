import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: BookOpen,
      title: 'Rich Note Taking',
      description: 'Create beautiful notes with rich formatting and organize your thoughts effortlessly.',
    },
    {
      icon: Zap,
      title: 'Drag & Drop',
      description: 'Rearrange your notes with intuitive drag and drop functionality.',
    },
    {
      icon: Sparkles,
      title: 'Beautiful Design',
      description: 'Enjoy a modern, clean interface that adapts to your preferred theme.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your notes are protected with JWT authentication and secure storage.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Notes App</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden sm:flex space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Beautiful Notes</span>
            <br />
            Made Simple
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Organize your thoughts, ideas, and inspiration with our modern note-taking app. 
            Features drag-and-drop organization, beautiful themes, and secure cloud storage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/register">Start Taking Notes</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make note-taking enjoyable and productive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={feature.title} className="auth-card hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="auth-card max-w-4xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Ready to Get Started?
            </CardTitle>
            <CardDescription className="text-xl">
              Join thousands of users who trust our app with their most important thoughts and ideas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/login">Sign In to Existing Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Notes App</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Notes App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
