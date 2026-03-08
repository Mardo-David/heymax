import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Menu, X, Activity, MessageSquare, Zap, Smartphone, CheckCircle, Database, ChevronDown } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
        <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Funcionalidades</a>
        <a href="#protocol" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Protocolo</a>
        <a href="#faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">FAQ</a>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <a href="/login" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Acessar</a>
        <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-background transition-all hover:scale-[1.03] active:scale-95" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
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
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          alt="Academia Premium"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8 hero-elem backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-mono text-primary font-medium tracking-wide border-r border-primary/30 pr-2 mr-2">v2.0 LIVE</span>
          <span className="text-xs font-sans text-foreground/80 font-medium tracking-wide">IA para Academias e Studios</span>
        </div>

        <h1 className="flex flex-col gap-2 mb-8 max-w-4xl">
          <span className="hero-elem font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight text-foreground/90 leading-tight">
            Seu ERP avisa quem vai cancelar.
          </span>
          <span className="hero-elem font-serif italic font-medium text-5xl md:text-6xl lg:text-8xl text-white leading-none tracking-tight">
            O HeyMax faz eles ficarem.
          </span>
        </h1>

        <p className="hero-elem font-sans text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 leading-relaxed">
          Identifique alunos em risco, recupere frequência via WhatsApp e maximize o faturamento com uma gestão de relacionamento invisível e imparável.
        </p>

        <div className="hero-elem flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-[2rem] bg-primary px-8 py-4 text-base font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,230,96,0.3)]">
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

// --- SILENT ESCAPE (A Dor) ---
const SilentEscape = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.silent-elem', {
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 px-6 relative bg-background border-t border-white/5 overflow-hidden">
      {/* Glow Sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="silent-elem font-serif italic text-4xl md:text-5xl lg:text-6xl text-foreground/90 leading-tight">
          A <span className="not-italic font-sans font-bold text-primary px-1">"Fuga Silenciosa"</span> está devorando seu lucro?
        </h2>
        <p className="silent-elem mt-8 text-foreground/60 font-sans max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          Mesmo com um espaço incrível, alunos cancelam planos sem dizer uma palavra. A IA da HeyMax identifica os sinais invisíveis de evasão <span className="text-foreground">antes que seja tarde demais.</span>
        </p>
      </div>
    </section>
  );
};

// --- 3. INTEGRATIONS MARQUEE ---
const IntegrationsMarquee = () => {
  return (
    <div className="w-full bg-background border-y border-white/5 py-8 overflow-hidden relative flex flex-col items-center">
      <p className="text-xs font-mono text-foreground/40 mb-6 uppercase tracking-[0.2em]">Integração Perfeita com o Seu Ecossistema</p>

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex gap-16 items-center w-max animate-[marquee_20s_linear_infinite]">
        {[1, 2].map((group) => (
          <React.Fragment key={group}>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-sans font-bold text-xl tracking-tight">Next Fit</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Zap className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">ABC Evo</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Smartphone className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">Wellhub</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <CheckCircle className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">TotalPass</span>
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
  const fullText = "Opa Lucas, sumiu hein? Saudade de você por aqui! Topa um treino hoje às 18h?";

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
    <div className="h-full bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col transition-all hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_10px_40px_-10px_rgba(0,230,96,0.15)] group relative overflow-hidden">
      <div className="relative z-10 mb-6">
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Direto no WhatsApp</h3>
        <p className="text-foreground/60 font-sans leading-relaxed text-sm">Recupere a frequência com comunicações personalizadas via WhatsApp.</p>
      </div>

      <div className="relative flex-1 bg-[#0b141a] rounded-[2rem] border-[6px] border-[#1f2c34] p-0 flex flex-col overflow-hidden w-full max-w-[260px] mx-auto shadow-2xl">
        {/* WA Header */}
        <div className="flex items-center gap-3 bg-[#202c33] px-3 py-2 shrink-0">
          <div className="flex items-center gap-1 text-[#8696a0]">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ml-1">
              <span className="text-sm text-primary font-bold">L</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#e9edef] font-medium leading-tight">Lucas M.</span>
            <span className="text-[11px] text-[#8696a0] leading-tight">visto por último hoje às 14:32</span>
          </div>
        </div>

        {/* WA Chat Body (Background Pattern) */}
        <div className="flex-1 bg-[#0b141a] relative flex flex-col justify-end p-3 gap-2 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/922/488/png-transparent-whatsapp-icon-logo-whatsapp-logo-whatsapp-logo-text-logo-grass.png")', backgroundSize: '100px' }}></div>

          {/* Day Label */}
          <div className="self-center bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg shadow-sm z-10 mb-2">
            HOJE
          </div>

          {/* AI Bubble (Right) */}
          <div className="relative self-end bg-[#005c4b] text-[#e9edef] text-[13px] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[95%] shadow-sm z-10">
            {/* Tail */}
            <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[8px] text-[#005c4b] fill-current">
              <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
            </svg>
            <span className="font-sans leading-[1.3] block pb-3">{text}<span className="inline-block w-1.5 h-3 bg-white/50 animate-pulse ml-0.5 align-middle"></span></span>
            <div className="absolute bottom-1 right-2 flex items-center gap-1">
              <span className="text-[10px] text-[#8696a0] leading-none">16:42</span>
              <svg viewBox="0 0 16 11" width="16" height="11" className="text-[#53bdeb] fill-current">
                <path d="M11.8 1L7 6.1 5.7 4.7l-1.4 1.5 2.7 2.8L13.2 2.5zM15.4 2.5L10.6 7.6l-1-1.1-1.4 1.5 2.4 2.5L16.8 4zM2.8 7.6L1.5 6.1 0 7.6 2.7 10.4l1.4-1.5z"></path>
              </svg>
            </div>
          </div>
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 py-4 w-full">
        {/* Widget 1 */}
        <div className="w-full max-w-[240px] bg-background/80 backdrop-blur-sm border border-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:border-primary/60 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-lg">R$</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-foreground/60">Receita Recuperada Hoje</span>
            <span className="text-lg font-sans font-bold text-white leading-tight">R$ 4.850,00</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="w-full max-w-[240px] bg-background/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ml-8 group-hover:border-white/30 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-foreground/60">LTV Expandido</span>
            <span className="text-sm font-sans font-bold text-white leading-tight">+6 meses renovados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 lg:px-20 bg-background relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[420px]">
          <FeatureCard1 />
          <FeatureCard2 />
          <FeatureCard3 />
        </div>
      </div>
    </section>
  );
};

// --- PROTOCOL (Sticky Stacking) ---
const ProtocolSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // The cards overlap exactly, so we use their index to stagger the animation trigger
      cardsRef.current.forEach((card, i) => {
        if (!card || i === 0) return;
        gsap.fromTo(cardsRef.current[i - 1],
          { scale: 1, opacity: 1, filter: "blur(0px)" },
          {
            scale: 0.9,
            opacity: 0.3,
            filter: "blur(8px)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${i * window.innerHeight * 0.8} top`,
              end: `top+=${(i + 1) * window.innerHeight * 0.8} top`,
              scrub: true,
            }
          }
        );

        // At the same time, fade in the current card
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${i * window.innerHeight * 0.8} top`,
              end: `top+=${(i + 1) * window.innerHeight * 0.8} top`,
              scrub: true,
            }
          }
        );
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: true,
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: "01", title: "Conecta & Mapeia", desc: "Nossa IA se integra ao seu sistema atual e absorve todo o histórico de frequência e pagamentos dos seus alunos em segundos." },
    { num: "02", title: "Analisa & Prevê", desc: "Através do Diagnostic Shuffler, o algoritmo calcula a % de risco de evasão de cada cliente, revelando padrões silenciosos que um humano não veria." },
    { num: "03", title: "Ação & Recuperação", desc: "A IA dispara a mensagem certa, na hora certa, via WhatsApp. Sem parecer um robô, reengajamos seu aluno e evitamos o churn imediatamente." }
  ];

  return (
    <section id="protocol" ref={containerRef} className="h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-brand-dark/50 opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="relative w-full max-w-4xl px-6 h-[60vh] md:h-[50vh]">
        {steps.map((step, i) => (
          <div
            key={i}
            ref={el => cardsRef.current[i] = el}
            className={`absolute inset-0 w-full h-full bg-[#121826] border border-white/10 rounded-[3rem] shadow-2xl p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 ${i !== 0 ? 'opacity-0 translate-y-24' : ''}`}
            style={{ zIndex: i + 10 }}
          >
            <div className="flex-1 text-center md:text-left">
              <span className="font-mono text-primary text-xl font-bold mb-4 block">PASS_{step.num}</span>
              <h2 className="font-sans font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">{step.title}</h2>
              <p className="font-sans text-lg md:text-xl text-foreground/60 leading-relaxed">{step.desc}</p>
            </div>

            {/* Visual Abstract for each step */}
            <div className="w-40 h-40 md:w-64 md:h-64 shrink-0 rounded-full border border-white/5 bg-background/50 flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
              {i === 0 && <Database className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />}
              {i === 1 && <Activity className="w-12 h-12 md:w-16 md:h-16 text-primary animate-bounce" />}
              {i === 2 && <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-primary" />}
              <div className="absolute inset-4 rounded-full border border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
        ))}
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
        scrollTrigger: { trigger: philoRef.current, start: "top 70%" },
        y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
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
          Atrair alunos custa caro. Perdê-los em silêncio quebra o seu negócio.
        </p>
        <h2 className="philo-text font-serif italic text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight">
          Nós focamos em: <br />
          <span className="text-primary not-italic font-sans font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter shadow-primary drop-shadow-2xl inline-block mt-4">Recuperação<br />Ativa.</span>
        </h2>
      </div>
    </section>
  );
};

// --- FAQ Section ---
const FAQSection = () => {
  return (
    <section id="faq" className="py-24 px-6 lg:px-20 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-12 text-center">Protocolos de Dúvida Frequente</h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              A inteligência artificial parece robótica ou impessoal?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Não. O nosso "Telemetry Typewriter" simula as nuances de uma comunicação humana natural, entendendo o contexto de cada aluno (como lesões prévias ou preferência de horários) para gerar mensagens que conectam e convertem.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              Minha academia precisa de um sistema super avançado para rodar a HeyMax?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Zero complicação. A HeyMax se integra em poucos minutos aos principais softwares do mercado (Evo, Pacto, CloudGym, Tecnofit). Em 24 horas a IA já absorveu o histórico e está prevendo riscos.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              Isso vai dar mais trabalho para o meu time de recepção/vendas?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Pelo contrário. A HeyMax trabalha em "modo background", agindo automaticamente nos alunos sob o risco de evasão. Seu time será focado apenas nos casos críticos ou de altíssima conversão de upsell que a IA também sinaliza.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

// --- 6. CTA / PRICING ---
const CTASection = () => {
  return (
    <section id="planos" className="py-32 px-6 lg:px-20 bg-background relative border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full bg-white/5 border border-primary/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shine_1.5s_ease-in-out]"></div>

        <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">Pronto para blindar seu faturamento?</h2>
        <p className="font-sans text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
          Pare de perder alunos silenciosamente. Implemente a IA que identifica, engaja e retém seus clientes no piloto automático.
        </p>

        <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-full bg-primary px-10 py-5 text-lg font-bold text-background transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_60px_rgba(0,230,96,0.4)] mx-auto inline-flex items-center gap-3">
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
            <li><a href="#" className="hover:text-primary transition-colors">Protocolo GSAP</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Integrações API</a></li>
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
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
        <p>V 2.1.0 - BR_SA</p>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <SilentEscape />
      <IntegrationsMarquee />
      <FeaturesSection />
      <ProtocolSection />
      <Philosophy />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
