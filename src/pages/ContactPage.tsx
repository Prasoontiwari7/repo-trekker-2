import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;