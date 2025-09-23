import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Shield, Smartphone, Brain, MapPin, Users, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Interactive3DWorld } from '@/components/3d/Interactive3DWorld';
import digitalIdIcon from "@/assets/icons/digital-id-icon.png";
import aiDetectionIcon from "@/assets/icons/ai-detection-icon.png";
import geoFenceIcon from "@/assets/icons/geo-fence-icon.png";
import sosAlertIcon from "@/assets/icons/sos-alert-icon.png";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Interactive World Background */}
      <Interactive3DWorld mousePosition={mousePosition} />
      

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-8">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered • Blockchain-Secured • Privacy-First
            </span>
          </div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Secure Travel with</span>
            <br />
            <span className="text-primary font-bold">
              GoSecure
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Next-generation AI-powered platform combining blockchain security, real-time geo-fencing, 
            and intelligent monitoring to deliver unparalleled safety for travelers worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-glow"
            >
              Get Started
              <Zap className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 hover:bg-primary/5 hover:scale-105 transition-all duration-300"
            >
              View Demo
              <Shield className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Feature Icons Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-md rounded-xl border border-border/30 hover:shadow-glow transition-smooth group hover:scale-105">
              <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-bounce">
                <img src={digitalIdIcon} alt="Digital ID" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2">Digital ID</h3>
              <p className="text-sm text-primary-foreground/80 text-center">Blockchain-secured tourist identification</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-md rounded-xl border border-border/30 hover:shadow-glow transition-smooth group hover:scale-105">
              <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-bounce">
                <img src={aiDetectionIcon} alt="AI Detection" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2">AI Detection</h3>
              <p className="text-sm text-primary-foreground/80 text-center">Smart anomaly detection & alerts</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-md rounded-xl border border-border/30 hover:shadow-glow transition-smooth group hover:scale-105">
              <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-bounce">
                <img src={geoFenceIcon} alt="Geo-Fencing" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2">Geo-Fencing</h3>
              <p className="text-sm text-primary-foreground/80 text-center">Real-time location monitoring</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-md rounded-xl border border-border/30 hover:shadow-glow transition-smooth group hover:scale-105">
              <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-bounce">
                <img src={sosAlertIcon} alt="SOS Alerts" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2">SOS Alerts</h3>
              <p className="text-sm text-primary-foreground/80 text-center">Emergency response system</p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Trusted by Government Agencies & Tourism Departments</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Ministry of Tourism</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Police Department</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">State Tourism Board</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;