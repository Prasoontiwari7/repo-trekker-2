import { Users, Star, Shield } from "lucide-react";
import prasoonImage from "@/assets/illustrations/team/prasoon-tiwari.png";
import subhankarImage from "@/assets/illustrations/team/subhankar-srivastava.png";
import sarthakImage from "@/assets/illustrations/team/sarthak-misra.png";
import raghavImage from "@/assets/illustrations/team/raghav-pandey.png";
import chitranshiImage from "@/assets/illustrations/team/chitranshi-tiwari.png";
import samakshImage from "@/assets/illustrations/team/samaksh-dubey.png";

const Team = () => {
  const teamLeader = {
    name: "Prasoon Tiwari",
    role: "Team Leader",
    isLeader: true,
    image: prasoonImage,
    bio: "Leading innovative safety solutions and coordinating technical implementation across all project phases."
  };

  const teamMembers = [
    { name: "Subhankar Srivastava", image: subhankarImage },
    { name: "Sarthak Misra", image: sarthakImage },
    { name: "Raghav Pandey", image: raghavImage },
    { name: "Chitranshi Tiwari", image: chitranshiImage },
    { name: "Samaksh Dubey", image: samakshImage },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Meet Our
            <span className="text-primary font-bold ml-3">
              Expert Team
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Dedicated professionals working together to revolutionize tourist safety 
            through innovative technology and collaborative expertise.
          </p>
        </div>

        {/* Team Leader */}
        <div className="flex justify-center mb-12">
          <div className="group p-8 bg-gradient-card rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-smooth max-w-md hover:scale-105">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-glow border-4 border-primary/30">
                  <img 
                    src={teamLeader.image} 
                    alt={teamLeader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-2 shadow-md">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{teamLeader.name}</h3>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{teamLeader.role}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {teamLeader.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-border shadow-md hover:shadow-lg transition-smooth hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 group-hover:shadow-glow transition-smooth border-2 border-border/20">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                  {member.name}
                </h3>
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                  Team Member
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 border border-primary/10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Combined Experience Hours</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">Shared Vision</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;