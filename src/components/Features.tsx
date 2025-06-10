
import { Zap, Shield, Rocket, Code2, Globe, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized infrastructure and cutting-edge technology.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and advanced threat protection.",
  },
  {
    icon: Rocket,
    title: "Scale Instantly",
    description: "From startup to enterprise, scale seamlessly without worrying about infrastructure limits.",
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "Built by developers, for developers. Clean APIs, extensive docs, and powerful tools.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Deploy worldwide with our global CDN and edge computing capabilities.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together efficiently with real-time collaboration and advanced project management.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to accelerate your development and scale your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
