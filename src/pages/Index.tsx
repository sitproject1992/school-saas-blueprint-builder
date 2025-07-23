import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  School,
  Smartphone,
  Globe,
  Heart,
  Building,
  Eye,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Student Management",
      description:
        "Complete student lifecycle management with profiles, attendance tracking, and academic records.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Teacher Portal",
      description:
        "Empower educators with lesson planning, grade management, and student progress tracking tools.",
      color: "text-green-600",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Automated timetables, exam scheduling, and event management with conflict detection.",
      color: "text-purple-600",
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description:
        "Streamlined fee collection, invoice generation, and comprehensive financial reporting.",
      color: "text-orange-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Real-time insights into academic performance, attendance trends, and institutional metrics.",
      color: "text-pink-600",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with role-based access control and data protection compliance.",
      color: "text-red-600",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students Managed", icon: GraduationCap },
    { number: "500+", label: "Schools Trust Us", icon: School },
    { number: "99.9%", label: "Uptime Guarantee", icon: Clock },
    { number: "24/7", label: "Support Available", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              🎓 Trusted by 500+ Educational Institutions
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Future of School Management is Here
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your educational institution with our comprehensive,
            cloud-based platform. From admissions to graduation, manage every
            aspect of your school with confidence.
          </p>

          {/* User Pathways */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
              <div className="text-center space-y-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <School className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">New Schools</h3>
                <p className="text-muted-foreground text-sm">
                  Register your educational institution and start your digital transformation journey
                </p>
                <Button asChild className="w-full">
                  <Link to="/school-registration">
                    Register Your School
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-green-200">
              <div className="text-center space-y-4">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">School Users</h3>
                <p className="text-muted-foreground text-sm">
                  Administrators, teachers, students, and parents - access your school portal
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth">Sign In to Your School</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <div className="text-center space-y-4">
                <div className="p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Try Demo</h3>
                <p className="text-muted-foreground text-sm">
                  Explore all features with pre-configured demo accounts and sample data
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/auth">Explore Demo</Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Run Your School
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for educational
              institutions of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader>
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gray-50 w-fit mb-4 group-hover:scale-110 transition-transform ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Schools Choose Skooler
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Reduce Administrative Burden
                    </h3>
                    <p className="text-blue-100">
                      Automate routine tasks and free up time for what matters
                      most - education.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Improve Parent Engagement
                    </h3>
                    <p className="text-blue-100">
                      Real-time updates and transparent communication strengthen
                      the school community.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Data-Driven Decisions
                    </h3>
                    <p className="text-blue-100">
                      Make informed decisions with comprehensive analytics and
                      reporting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Scale with Confidence
                    </h3>
                    <p className="text-blue-100">
                      Our platform grows with your institution, from 50 to 5000+
                      students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Cloud-Based</h3>
                <p className="text-blue-100 text-sm">
                  Access from anywhere, anytime
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Mobile Ready</h3>
                <p className="text-blue-100 text-sm">
                  Native mobile apps available
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Secure</h3>
                <p className="text-blue-100 text-sm">Bank-level security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-blue-100 text-sm">24/7 customer care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of educators who have already revolutionized their
            school management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link to="/school-registration">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              <Link to="/auth">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <School className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Skooler</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering educational institutions with modern, comprehensive
                school management solutions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Skooler Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
