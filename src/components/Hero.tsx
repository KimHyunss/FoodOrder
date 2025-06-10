
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Build the future
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                one line at a time
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in animation-delay-200">
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into reality with our powerful platform. 
              Experience seamless development, innovative tools, and unmatched performance.
            </p>
          </div>

          <div className="animate-fade-in animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="animate-fade-in animation-delay-600">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl rounded-full"></div>
              <div className="relative bg-card border border-border rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-left font-mono text-sm">
                  <div className="text-muted-foreground">// Welcome to the future</div>
                  <div className="text-primary">const innovation = () =&gt; {"{"}</div>
                  <div className="ml-4 text-foreground">return &quot;endless possibilities&quot;;</div>
                  <div className="text-primary">{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
