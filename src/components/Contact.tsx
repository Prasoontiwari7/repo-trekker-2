import { useState } from "react";
import { Phone, Mail, MessageCircle, Clock, Shield, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          message: `Subject: ${formData.subject}\n\n${formData.message}`,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const emergencyNumbers = [
    {
      title: "Tourist Emergency Helpline",
      number: "1800-11-1363",
      description: "24/7 tourist safety emergency line",
      icon: Phone,
      urgent: true,
    },
    {
      title: "Police Coordination Center",
      number: "100",
      description: "Police emergency response",
      icon: Shield,
      urgent: true,
    },
    {
      title: "Medical Emergency",
      number: "102",
      description: "Ambulance services",
      icon: Phone,
      urgent: true,
    },
    {
      title: "Medical Support Team",
      number: "104",
      description: "Medical consultation",
      icon: Phone,
      urgent: false,
    },
  ];

  const supportEmails = [
    "tiwariprasoon173@gmail.com",
    "sarthak2005misra@gmail.com", 
    "subhankarsrivastava480@gmail.com",
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Get Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact
            <span className="text-primary font-bold ml-3">
              Our Team
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Need help or have questions? Our support team is available 24/7 to assist you 
            with any safety concerns or technical support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-primary" />
              Send us a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What can we help you with?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {/* Technical Support */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-2">Technical Support</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For technical issues and support queries:
              </p>
              <a 
                href="mailto:GoSecure7@gmail.com"
                className="text-primary hover:text-primary-light transition-smooth font-medium"
              >
                GoSecure7@gmail.com
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Emergency Numbers */}
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                Emergency Helplines
              </h3>
              <div className="space-y-4">
                {emergencyNumbers.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-smooth hover:shadow-md ${
                        contact.urgent 
                          ? "bg-destructive/5 border-destructive/20" 
                          : "bg-muted/20 border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          contact.urgent ? "bg-destructive/10" : "bg-primary/10"
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            contact.urgent ? "text-destructive" : "text-primary"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{contact.title}</h4>
                          <div className={`text-lg font-bold ${
                            contact.urgent ? "text-destructive" : "text-primary"
                          }`}>
                            {contact.number}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Team */}
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                Support Team
              </h3>
              <div className="space-y-3">
                {supportEmails.map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    className="block p-3 rounded-lg border border-border hover:bg-accent/50 transition-smooth group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary group-hover:text-primary-light transition-smooth" />
                      <span className="text-foreground group-hover:text-primary transition-smooth">
                        {email}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                Support Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-success/5 border border-success/20">
                  <span className="font-medium text-foreground">Emergency Support</span>
                  <span className="text-success font-semibold">24/7 Available</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20 border border-border">
                  <span className="font-medium text-foreground">General Support</span>
                  <span className="text-primary font-semibold">9 AM - 6 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;