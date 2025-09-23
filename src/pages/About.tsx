import Navbar from "@/components/Navbar";
import { Shield, Target, Eye, Users, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const challenges = [
    {
      title: "Tourist Safety Concerns",
      description: "Increasing incidents of tourist-related crimes and emergencies worldwide",
      impact: "12% annual increase in tourist safety incidents"
    },
    {
      title: "Delayed Emergency Response",
      description: "Average emergency response time for tourists is 35% longer than locals",
      impact: "Critical time lost during emergencies"
    },
    {
      title: "Communication Barriers",
      description: "Language barriers prevent effective communication during emergencies",
      impact: "60% of tourist incidents involve communication issues"
    },
    {
      title: "Lack of Real-time Monitoring",
      description: "Traditional safety systems are reactive rather than proactive",
      impact: "Incidents detected only after they occur"
    }
  ];

  const solutions = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable digital identity and transaction records ensure data integrity and prevent fraud."
    },
    {
      icon: Zap,
      title: "AI-Powered Detection",
      description: "Machine learning algorithms predict and prevent safety incidents before they occur."
    },
    {
      icon: Globe,
      title: "Global Connectivity",
      description: "Seamless international coverage with multi-language support for universal accessibility."
    },
    {
      icon: Users,
      title: "Multi-Agency Coordination",
      description: "Integrated platform connecting tourists, police, medical services, and tourism authorities."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-8">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Our Mission
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Revolutionizing</span>
              <br />
              <span className="text-primary font-bold">
                Tourist Safety
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're building the future of tourist safety through innovative technology, 
              combining AI, blockchain, and real-time monitoring to create safer travel experiences worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Creating Safer Travel
                <span className="text-primary font-bold ml-2">
                  Experiences
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Our mission is to leverage cutting-edge technology to create a comprehensive safety 
                ecosystem that protects tourists worldwide. We believe that travel should be safe, 
                secure, and worry-free for everyone, regardless of their destination or background.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Enhanced Security</h3>
                    <p className="text-muted-foreground text-sm">Blockchain-secured digital identity and encrypted data protection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Rapid Response</h3>
                    <p className="text-muted-foreground text-sm">AI-powered threat detection with instant emergency alerts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Global Coverage</h3>
                    <p className="text-muted-foreground text-sm">Worldwide accessibility with multilingual support</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
                <Eye className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A World Where
                <span className="text-accent font-bold ml-2">
                  Travel is Safe
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We envision a future where advanced technology seamlessly integrates with 
                travel experiences, providing invisible yet comprehensive protection for 
                every tourist, enabling them to explore the world with complete confidence.
              </p>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-4">Key Objectives</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Reduce tourist safety incidents by 75%
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Achieve sub-minute emergency response times
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Provide 24/7 multilingual support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Ensure 99.9% system availability
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tourism Safety
              <span className="text-primary font-bold ml-3">
                Challenges
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Understanding the critical challenges facing tourist safety today and 
              how innovative technology can provide effective solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {challenges.map((challenge, index) => (
              <div key={index} className="p-6 bg-card rounded-xl border border-border shadow-md">
                <h3 className="text-xl font-bold text-foreground mb-3">{challenge.title}</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <span className="text-sm font-medium text-destructive">{challenge.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Technology-Driven
              <span className="text-primary font-bold ml-3">
                Solutions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our innovative approach combines AI, blockchain, and IoT technologies 
              to address critical safety challenges in the tourism industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="group p-8 bg-card rounded-xl border border-border shadow-md hover:shadow-xl transition-smooth">
                  <div className="bg-gradient-primary p-3 rounded-lg inline-flex mb-6 group-hover:shadow-glow transition-smooth">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-smooth">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Projected
              <span className="text-primary font-bold ml-3">
                Impact
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach aims to transform tourist safety metrics globally
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">75%</div>
              <div className="text-sm text-muted-foreground mb-2">Reduction in Safety Incidents</div>
              <p className="text-xs text-muted-foreground">Through proactive AI monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">&lt;60s</div>
              <div className="text-sm text-muted-foreground mb-2">Emergency Response Time</div>
              <p className="text-xs text-muted-foreground">Rapid alert and dispatch system</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground mb-2">Continuous Monitoring</div>
              <p className="text-xs text-muted-foreground">Global coverage and support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground mb-2">Countries Covered</div>
              <p className="text-xs text-muted-foreground">Worldwide implementation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join the Safety Revolution
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of the future of tourist safety. Together, we can create a world where travel is safe for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Get Involved
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;