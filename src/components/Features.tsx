import React from 'react';
import { Shield, Smartphone, Brain, MapPin, Monitor, Wifi, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feature3D } from "@/components/3d/Feature3D";
import digitalIdIcon from "@/assets/icons/digital-id-icon.png";
import aiDetectionIcon from "@/assets/icons/ai-detection-icon.png";
import geoFenceIcon from "@/assets/icons/geo-fence-icon.png";
import sosAlertIcon from "@/assets/icons/sos-alert-icon.png";

const Features = () => {
  const features3D = [
    {
      title: "Digital ID Verification",
      description: "Blockchain-secured tourist identification with biometric authentication",
      icon: "🆔",
      color: "#FF6B35"
    },
    {
      title: "AI-Powered Detection",
      description: "Smart anomaly detection system with real-time threat analysis",
      icon: "🤖",
      color: "#4ECDC4"
    },
    {
      title: "Geo-Fencing Protection",
      description: "Real-time location monitoring with customizable safety zones",
      icon: "📍",
      color: "#45B7D1"
    },
    {
      title: "Emergency SOS System",
      description: "Instant emergency alerts with automated response coordination",
      icon: "🚨",
      color: "#FFA07A"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Blockchain-based Digital ID",
      description: "Secure, tamper-proof digital identification for tourists using blockchain technology. Instant verification and global recognition.",
      gradient: "bg-gradient-primary",
    },
    {
      icon: Smartphone,
      title: "Mobile App with SOS",
      description: "Comprehensive mobile application with real-time tracking, safety scores, and one-touch emergency SOS broadcasting.",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: Brain,
      title: "AI Anomaly Detection",
      description: "Advanced machine learning algorithms detect unusual patterns and potential threats, providing proactive safety alerts.",
      gradient: "bg-gradient-accent",
    },
    {
      icon: MapPin,
      title: "Geo-fencing Alerts",
      description: "Smart location boundaries that automatically alert authorities when tourists enter or exit designated safe zones.",
      gradient: "bg-gradient-primary",
    },
    {
      icon: Monitor,
      title: "Police & Tourism Dashboard",
      description: "Real-time monitoring dashboards for law enforcement and tourism officials with incident management capabilities.",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: Wifi,
      title: "IoT Wearables",
      description: "Optional smart wearable devices for continuous health and location monitoring with emergency features.",
      gradient: "bg-gradient-accent",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Full application support in multiple languages including English and regional Indian languages for seamless communication.",
      gradient: "bg-gradient-primary",
    },
  ];

  return (
    <section className="py-20 bg-gradient-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Safety
            <span className="text-primary font-bold ml-3">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our platform combines cutting-edge technology with practical safety solutions 
            to create the most comprehensive tourist safety monitoring system available.
          </p>
        </div>

        {/* 3D Feature Showcase */}
        <div className="mb-16">
          <Feature3D features={features3D} />
        </div>

        {/* Enhanced Features Grid with 3D Context */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-card/80 backdrop-blur-md rounded-xl border border-border/50 shadow-md hover:shadow-glow transition-smooth hover:transform hover:scale-105 hover:bg-card/90"
              >
                <div className={`inline-flex p-3 rounded-lg mb-6 ${feature.gradient} group-hover:shadow-glow transition-smooth`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-4 group-hover:text-primary transition-smooth">
                  {feature.title}
                </h3>
                <p className="text-black dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Enhanced Benefits Section */}
        <div className="bg-primary/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-primary/10 shadow-glow">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary animate-pulse">99.9%</div>
              <div className="text-sm text-muted-foreground">Response Accuracy</div>
              <p className="text-sm text-muted-foreground">
                Lightning-fast incident detection and response with near-perfect accuracy rates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary animate-pulse">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
              <p className="text-sm text-muted-foreground">
                Round-the-clock safety monitoring with real-time alerts and emergency response.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary animate-pulse">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Protected</div>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption and blockchain security ensuring complete data privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-glow"
          >
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;