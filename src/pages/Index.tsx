import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Menu, X, Activity, MessageSquare, TrendingUp, Zap, Smartphone, CheckCircle, CalendarDays, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent'}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-background" />
        </div>
        <span className="font-sans font-bold text-xl tracking-tight">HeyMax.fit</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Features</a>
        <a href="#manifesto" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Manifesto</a>
        <a href="#planos" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Planos</a>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <a href="/login" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Acessar</a>
        <button className="group relative overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-background transition-all hover:scale-[1.03] active:scale-95" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
          <span className="relative z-10 flex items-center gap-2">
            Agendar Demonstração <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
};

// --- 2. HERO ---
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-end pb-32 pt-40 px-6 lg:px-20 overflow-hidden">
      {/* Imagem de Fundo Premium - Vitalidade Humana em Fundo Escuro */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          alt="Academia Premium"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Gradiente para fundir a imagem com o dark background no inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8 hero-elem backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-mono text-primary font-medium tracking-wide border-r border-primary/30 pr-2 mr-2">v2.0 LIVE</span>
          <span className="text-xs font-sans text-foreground/80 font-medium tracking-wide">AI Engine para Academias</span>
        </div>

        <h1 className="flex flex-col gap-2 mb-8 max-w-4xl">
          <span className="hero-elem font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight text-foreground/90 leading-tight">
            Inteligência Artificial encontra a
          </span>
          <span className="hero-elem font-serif italic font-medium text-6xl md:text-7xl lg:text-9xl text-white leading-none tracking-tight">
            Retenção Extrema.
          </span>
        </h1>

        <p className="hero-elem font-sans text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 leading-relaxed">
          Identifique alunos em risco, recupere frequência via WhatsApp e maximize o faturamento com uma gestão de relacionamento invisível e imparável.
        </p>

        <div className="hero-elem flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="group relative overflow-hidden rounded-[2rem] bg-primary px-8 py-4 text-base font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,230,96,0.3)]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Agendar Minha Demonstração <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

// --- 3. INTEGRATIONS MARQUEE ---
const IntegrationsMarquee = () => {
  return (
    <div className="w-full bg-background border-y border-white/5 py-8 overflow-hidden relative flex flex-col items-center">
      <p className="text-xs font-mono text-foreground/40 mb-6 uppercase tracking-[0.2em]">O sistema nervoso da sua operação</p>

      {/* Degrades nas bordas para suavizar o carrossel */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex gap-16 items-center w-max animate-[marquee_20s_linear_infinite]">
        {/* Simulação de logos para dar autoridade - replicado para loop contínuo */}
        {[1, 2].map((group) => (
          <React.Fragment key={group}>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="font-sans font-bold text-xl tracking-tight">WhatsApp OBA</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Zap className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">EVO Mkt</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Activity className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">CloudGym</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Database className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">Pacto CRM</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Smartphone className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">Tecnofit</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
import { Database } from 'lucide-react'; // Moved down for clean grouping

// --- 4. FEATURES (ARTEFATOS) ---
const FeatureCard1 = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Lucas M.", risk: "94% Evasão", tag: "Faltou 12 dias" },
    { id: 2, name: "Mariana S.", risk: "82% Evasão", tag: "Mensalidade Vencida" },
    { id: 3, name: "Pedro A.", risk: "76% Evasão", tag: "Sem treino AB" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const last = newItems.pop()!;
        newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_rgba(0,230,96,0.15)] overflow-hidden">
      <div className="mb-8">
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Predição de Churn</h3>
        <p className="text-foreground/60 font-sans leading-relaxed">Padrões de comportamento analisados por IA identificam alunos em risco antes do cancelamento.</p>
      </div>

      <div className="relative flex-1 min-h-[160px] flex items-center justify-center">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="absolute w-full max-w-[280px] bg-background border border-white/10 rounded-2xl p-4 transition-all duration-700 shadow-xl"
            style={{
              transform: `translateY(${i * 12}px) scale(${1 - i * 0.05})`,
              opacity: 1 - i * 0.3,
              zIndex: 10 - i,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm text-foreground">{item.name}</span>
              <span className="font-mono text-xs text-[#E63B2E] font-bold bg-[#E63B2E]/10 px-2 py-1 rounded">{item.risk}</span>
            </div>
            <div className="text-xs font-sans text-foreground/50 border-l-2 border-primary/50 pl-2">{item.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard2 = () => {
  const [text, setText] = useState("");
  const fullText = "Opa Lucas, tudo bem? Notei que você não vem treinar há 12 dias. Saudade de você por aqui! Topa um treino hoje às 18h?";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => { setText(""); index = 0; setIntervalFunc(); }, 5000);
      }
    }, 50);

    const setIntervalFunc = () => {
      const newInterval = setInterval(() => {
        setText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(newInterval);
          setTimeout(() => { setText(""); index = 0; setIntervalFunc(); }, 5000);
        }
      }, 50);
    };

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_rgba(0,230,96,0.15)] group">
      <div className="mb-8">
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Engajamento WhatsApp</h3>
        <p className="text-foreground/60 font-sans leading-relaxed">Recupere a frequência com comunicações personalizadas e automatizadas com alta conversão.</p>
      </div>

      <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-sm text-primary leading-relaxed flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-foreground/50 text-xs">Terminal_WhatsApp_API</span>
        </div>
        <div className="flex-1">
          {text}<span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle"></span>
        </div>
      </div>
    </div>
  );
};

const FeatureCard3 = () => {
  return (
    <div className="h-full bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_rgba(0,230,96,0.15)] group overflow-hidden relative">
      <div className="relative z-10 mb-8">
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Maximização do LTV</h3>
        <p className="text-foreground/60 font-sans leading-relaxed">Aumente o tempo de permanência e o faturamento com uma gestão inteligente do ciclo de vida.</p>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-5 gap-2 content-end">
        {[20, 35, 60, 85, 120].map((height, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-full bg-primary/20 rounded-t-sm relative group-hover:bg-primary/40 transition-colors duration-500 overflow-hidden" style={{ height: `${height}px` }}>
              <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-[1.5s] ease-out delay-100" style={{ height: '0%', transformOrigin: 'bottom' }} />
              {/* Fake animation trigger via CSS - normally GSAP Scrolltrigger */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ transform: `translateY(${100 - (i * 20)}%)` }}></div>
            </div>
            <span className="text-[10px] font-mono text-foreground/40">M{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 lg:px-20 bg-background relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          <FeatureCard1 />
          <FeatureCard2 />
          <FeatureCard3 />
        </div>
      </div>
    </section>
  );
};

// --- 5. PHILOSOPHY ---
const Philosophy = () => {
  const philoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.philo-text', {
        scrollTrigger: {
          trigger: philoRef.current,
          start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      });
    }, philoRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={philoRef} className="py-40 px-6 lg:px-20 relative bg-[#0a0f18] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop"
          alt="Abstract Dark Texture"
          className="w-full h-full object-cover opacity-10 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[#0a0f18]/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <p className="philo-text font-sans text-xl md:text-2xl text-foreground/50 mb-8 font-medium">
          A maioria da indústria foca em: <span className="line-through">vender planos a qualquer custo</span>.
        </p>
        <h2 className="philo-text font-serif italic text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight">
          Nós focamos em: <br />
          <span className="text-primary not-italic font-sans font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter shadow-primary drop-shadow-2xl inline-block mt-4">Retenção<br />Inteligente.</span>
        </h2>
      </div>
    </section>
  );
};

// --- 6. CTA / PRICING ---
const CTASection = () => {
  return (
    <section id="planos" className="py-32 px-6 lg:px-20 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full bg-white/5 border border-primary/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shine_1.5s_ease-in-out]"></div>

        <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">Pronto para blindar seu faturamento?</h2>
        <p className="font-sans text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
          Pare de perder alunos silenciosamente. Implemente a IA que identifica, engaja e retém seus clientes no piloto automático.
        </p>

        <button className="group relative overflow-hidden rounded-full bg-primary px-10 py-5 text-lg font-bold text-background transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_60px_rgba(0,230,96,0.4)] mx-auto inline-flex items-center gap-3">
          <span className="relative z-10 flex items-center gap-2">
            Agendar Minha Demonstração <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </section>
  );
};

// --- 7. FOOTER ---
const Footer = () => {
  return (
    <footer className="bg-[#0a0f18] rounded-t-[4rem] pb-12 pt-24 px-6 lg:px-20 border-t border-white/5 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-background" />
            </div>
            <span className="font-sans font-bold text-2xl tracking-tight text-white">HeyMax.fit</span>
          </div>
          <p className="text-foreground/50 font-sans max-w-md mb-8">
            Inteligência Artificial especializada em retenção e engajamento para academias de alto desempenho.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="font-mono text-xs text-foreground/70 uppercase tracking-widest">Sistema Operacional Estável</span>
          </div>
        </div>

        <div>
          <h4 className="font-sans font-bold text-white mb-6">Produto</h4>
          <ul className="space-y-4 font-sans text-sm text-foreground/60">
            <li><a href="#" className="hover:text-primary transition-colors">Predição de Churn</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Agentes de WhatsApp</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Integrações API</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-4 font-sans text-sm text-foreground/60">
            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-foreground/40">
        <p>&copy; {new Date().getFullYear()} HeyMax.fit. Todos os direitos reservados.</p>
        <p>V 2.0.4 - BR_SA</p>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <IntegrationsMarquee />
      <FeaturesSection />
      <Philosophy />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
