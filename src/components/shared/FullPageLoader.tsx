import React from 'react';
import { GraduationCap } from 'lucide-react';

interface FullPageLoaderProps {
    message?: string;
    showBranding?: boolean;
}

export function FullPageLoader({ message, showBranding = true }: FullPageLoaderProps) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-500">
            <div className="relative flex flex-col items-center">
                {/* Animated Background Glow */}
                <div className="absolute -inset-24 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute -inset-12 bg-primary/5 rounded-full blur-[40px] animate-pulse [animation-delay:1s]" />
                
                {/* Logo Container with Glassmorphism */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative h-20 w-20 bg-background/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
                        <GraduationCap className="h-10 w-10 text-primary animate-bounce [animation-duration:3s]" />
                    </div>
                </div>
                
                {/* Branding & Loading Indicator */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    {showBranding && (
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold tracking-tighter text-foreground flex items-center">
                                VIZON<span className="text-primary">-X</span> <span className="ml-2 font-light text-muted-foreground">CRM</span>
                            </h2>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium opacity-70">
                                Premium Operations Suite
                            </p>
                        </div>
                    )}
                    
                    {/* Subtle Progress Track */}
                    <div className="mt-4 w-40 h-[2px] bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress-loading" />
                    </div>
                    
                    {message && (
                        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest mt-2">
                            {message}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Footer Tagline */}
            <div className="absolute bottom-8 text-[9px] text-muted-foreground/30 font-medium tracking-[0.2em] uppercase">
                Enterprise Cloud Security Active
            </div>
        </div>
    );
}

export default FullPageLoader;
