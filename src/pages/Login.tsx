import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Mail, Lock, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const Login = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.login-elem', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.1
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0f18] flex items-center justify-center relative overflow-hidden selection:bg-primary/30 selection:text-white font-sans p-6">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                    alt="Academia Premium"
                    className="w-full h-full object-cover opacity-[0.03] mix-blend-overlay grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/90 to-transparent"></div>
            </div>

            {/* Glow Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="login-elem flex justify-center mb-8">
                    <a href="/" className="group flex items-center gap-2 text-foreground/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Voltar para a Home</span>
                    </a>
                </div>

                <div className="login-elem bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Subtle top border gradient */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="font-sans font-bold text-3xl text-white tracking-tight mb-2">Painel de Gestão</h1>
                        <p className="text-foreground/50 text-sm font-medium text-center">Entre para acessar a inteligência artificial da HeyMax.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Seu e-mail corporativo"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary/50 focus:ring-offset-0 cursor-pointer" />
                                <span className="text-foreground/50 group-hover:text-white transition-colors">Lembrar acesso</span>
                            </label>
                            <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">Esqueceu a senha?</a>
                        </div>

                        <button type="submit" className="group relative overflow-hidden rounded-full bg-primary w-full py-4 text-base font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,230,96,0.2)] flex items-center justify-center gap-2 mt-8">
                            <span className="relative z-10 flex items-center gap-2">
                                Acessar Plataforma <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </form>
                </div>

                <div className="login-elem text-center mt-8">
                    <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest">
                        HeyMax.fit OS • v2.1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
