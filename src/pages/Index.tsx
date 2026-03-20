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
        <a href="#protocol" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:-translate-y-[1px]">Como Funciona</a>
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

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[#0a0f18]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center py-6 gap-6 transition-all duration-300 origin-top shadow-2xl ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80 hover:text-primary transition-colors">Funcionalidades</a>
        <a href="#protocol" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80 hover:text-primary transition-colors">Como Funciona</a>
        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80 hover:text-primary transition-colors">FAQ</a>
        <a href="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/60 hover:text-foreground transition-colors">Acessar</a>
        <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-all hover:scale-[1.03] active:scale-95">
          <span className="relative z-10 flex items-center gap-2">
            Agendar Demonstração <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
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
          <span className="text-xs font-mono text-primary font-medium tracking-wide border-r border-primary/30 pr-2 mr-2">Integração nativa com Evo e NextFit</span>
          <span className="text-xs font-sans text-foreground/80 font-medium tracking-wide">Funciona pelo WhatsApp · Zero trabalho para sua equipe</span>
        </div>

        <h1 className="flex flex-col gap-2 mb-8 max-w-4xl">
          <span className="hero-elem font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight text-foreground/90 leading-tight">
            Seu prospect fez a aula experimental.
          </span>
          <span className="hero-elem font-serif italic font-medium text-5xl md:text-6xl lg:text-8xl text-white leading-none tracking-tight">
            O HeyMax garante que ele volta.
          </span>
        </h1>

        <p className="hero-elem font-sans text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 leading-relaxed">
          Automatizamos o follow-up com quem visitou sua academia e não se matriculou, na hora certa, pelo WhatsApp, sem depender da recepção.
        </p>

        <div className="hero-elem flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-[2rem] bg-primary px-8 py-4 text-base font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,230,96,0.3)]">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Ver Como Funciona <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          Quantos prospects sumiram esse mês <span className="not-italic font-sans font-bold text-primary px-1">sem uma segunda chance?</span>
        </h2>
        <p className="silent-elem mt-8 text-foreground/60 font-sans max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          A aula experimental é o momento mais importante da jornada do aluno. Mas a recepção está ocupada, o follow-up não acontece, e o prospect some. O HeyMax entra em contato automaticamente, <span className="text-foreground">antes que ele escolha a academia do lado.</span>
        </p>
      </div>
    </section>
  );
};

// --- 3. INTEGRATIONS MARQUEE ---
const IntegrationsMarquee = () => {
  return (
    <div className="w-full bg-background border-y border-white/5 py-8 overflow-hidden relative flex flex-col items-center">
      <p className="text-xs font-mono text-foreground/40 mb-6 uppercase tracking-[0.2em]">Funciona com o ERP que você já usa</p>

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex gap-16 items-center w-max animate-[marquee_20s_linear_infinite]">
        {[1, 2].map((group) => (
          <React.Fragment key={group}>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-sans font-bold text-xl tracking-tight">Evo</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Zap className="w-6 h-6" />
              <span className="font-sans font-bold text-xl tracking-tight">NextFit</span>
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
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Follow-up Automático</h3>
        <p className="text-foreground/60 font-sans leading-relaxed">O prospect faz a aula experimental e some. O HeyMax entra em contato no dia seguinte, coleta o feedback e identifica quem está pronto para se matricular.</p>
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
        <p className="text-foreground/60 font-sans leading-relaxed text-sm">Sem app para instalar, sem portal para acessar. A comunicação acontece onde o aluno já está — e parece uma conversa real, não um disparo de marketing.</p>
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
        <h3 className="font-sans font-bold text-2xl text-white mb-3">Resultado no Painel</h3>
        <p className="text-foreground/60 font-sans leading-relaxed">Você abre o painel e vê quem respondeu, qual foi o NPS e quem sinalizou intenção de matrícula. Sua recepção só entra em ação quando o lead já está quente.</p>
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
      // Build a single master timeline so we can control pauses precisely
      const tl = gsap.timeline();

      // --- Hold Passo 01 visible (empty tween = pause in timeline) ---
      tl.to({}, { duration: 1 }); // ~33% of scroll just holding Passo 01

      // --- Transition: Passo 01 → Passo 02 ---
      const card0 = cardsRef.current[0];
      const card1 = cardsRef.current[1];
      const card2 = cardsRef.current[2];

      if (card0 && card1) {
        // Shrink/blur Passo 01 while fading in Passo 02
        tl.to(card0, { scale: 0.9, opacity: 0.3, filter: "blur(8px)", duration: 0.8, ease: "power2.inOut" }, "trans1");
        tl.fromTo(card1, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }, "trans1");
      }

      // --- Hold Passo 02 visible ---
      tl.to({}, { duration: 1 }); // pause for reading

      // --- Transition: Passo 02 → Passo 03 ---
      if (card1 && card2) {
        tl.to(card1, { scale: 0.9, opacity: 0.3, filter: "blur(8px)", duration: 0.8, ease: "power2.inOut" }, "trans2");
        tl.fromTo(card2, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }, "trans2");
      }

      // --- Hold Passo 03 visible ---
      tl.to({}, { duration: 0.6 }); // shorter hold before leaving section

      // Pin the section and scrub the timeline with scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: 0.5,
        animation: tl,
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: "01", title: "Conecta em minutos", desc: "Você passa sua chave da API do Evo ou NextFit e as informações básicas da academia. Sem configuração técnica, sem treinamento de equipe." },
    { num: "02", title: "Detecta automaticamente", desc: "Quando um prospect é cadastrado no seu ERP, o HeyMax já sabe. O contato acontece no momento certo — sem ninguém precisar apertar um botão." },
    { num: "03", title: "Entrega o lead pronto", desc: "Você recebe no painel quem tem intenção de se matricular, com o histórico da conversa. Sua recepção fecha a venda. O HeyMax fez o trabalho pesado." }
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
              <span className="font-mono text-primary text-xl font-bold mb-4 block">PASSO {step.num}</span>
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

// --- PLATAFORMA COMPLETA ---
const PlatformSection = () => {
  const platformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.platform-elem', {
        scrollTrigger: { trigger: platformRef.current, start: "top 80%" },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
      });
    }, platformRef);
    return () => ctx.revert();
  }, []);

  const available = [
    "Funil de aula experimental com follow-up automático",
    "NPS pós-visita",
    "Integração nativa com Evo e NextFit",
    "Painel de gestão da academia — configure sua IA, alimente a base de conhecimento e ela responde com as informações da sua academia",
    "IA com identidade própria — você escolhe o nome e o tom de comunicação que combina com sua marca",
  ];

  const comingSoon = [
    "Lembretes de treino personalizados",
    "Registro de presença automático via catraca",
    "Programa de recompensas por assiduidade (FitCoins)",
    "Relatório mensal de evolução para o aluno",
    "Campanhas de reativação para ex-alunos",
    "Acompanhamento de metas e objetivos individuais",
    "Comunicados e avisos institucionais via WhatsApp",
    "Atendimento automatizado 24h",
  ];

  return (
    <section ref={platformRef} className="py-24 px-6 lg:px-20 bg-background relative border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="platform-elem font-sans text-xl md:text-2xl text-foreground/70 mb-4 leading-relaxed">
            O funil de aula experimental é onde tudo começa.
          </p>
          <p className="platform-elem font-sans text-xl md:text-2xl text-white font-medium leading-relaxed">
            Mas o HeyMax foi construído para acompanhar o aluno do primeiro contato até a renovação.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Já disponível */}
          <div className="platform-elem bg-white/5 border border-primary/20 rounded-[2rem] p-8">
            <h3 className="font-sans font-bold text-lg text-primary mb-6 uppercase tracking-wide">Já disponível:</h3>
            <ul className="space-y-4">
              {available.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-sans text-foreground/80 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Em breve */}
          <div className="platform-elem bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="font-sans font-bold text-lg text-foreground/50 mb-6 uppercase tracking-wide">Em breve — para academias já na plataforma:</h3>
            <ul className="space-y-4">
              {comingSoon.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full border border-white/20 shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                  </span>
                  <span className="font-sans text-foreground/50 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="platform-elem text-center mt-12 font-sans text-base text-primary/80 font-medium">
          Clientes que entram agora têm acesso prioritário a cada funcionalidade no lançamento.
        </p>
      </div>
    </section>
  );
};

// --- 5. PHILOSOPHY / MANIFESTO ---
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
        <p className="philo-text font-sans text-xl md:text-2xl text-foreground/50 mb-2 font-medium">
          Trazer um aluno novo custa caro.
        </p>
        <p className="philo-text font-sans text-xl md:text-2xl text-foreground/50 mb-8 font-medium">
          Perder um prospect que já entrou pela sua porta é desperdício puro.
        </p>
        <h2 className="philo-text font-serif italic text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight">
          Nós focamos em: <br />
          <span className="text-primary not-italic font-sans font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter shadow-primary drop-shadow-2xl inline-block mt-4">Conversão<br />do que já chegou.</span>
        </h2>
      </div>
    </section>
  );
};

// --- DEPOIMENTO / TESTIMONIAL ---
const TestimonialSection = () => {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.testimonial-elem', {
        scrollTrigger: { trigger: testimonialRef.current, start: "top 80%" },
        y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
      });
    }, testimonialRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={testimonialRef} className="py-24 px-6 lg:px-20 bg-background relative border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="testimonial-elem bg-white/5 border border-white/10 rounded-[2rem] p-10 md:p-14 relative">
          {/* Quote mark */}
          <div className="absolute top-6 left-8 text-primary/20 text-7xl font-serif leading-none select-none">"</div>

          <blockquote className="testimonial-elem font-sans text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 pt-8">
            "O pós-venda e o atendimento aos alunos que não frequentavam a academia sempre foram um grande desafio pra nós da Treno. O Bell, nossa IA, foi muito importante na resolução desse problema, agora temos alguém que motiva, lembra dos treinos e engaja o aluno mesmo fora da academia."
          </blockquote>

          <div className="testimonial-elem flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden">
              <img src="/edgar.jpg" alt="Edgar Costa" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-sans font-bold text-white">Edgar Costa</p>
              <p className="font-sans text-sm text-foreground/50">CEO · Treno Academia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FAQ Section ---
const FAQSection = () => {
  return (
    <section id="faq" className="py-24 px-6 lg:px-20 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-12 text-center">Perguntas Frequentes</h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              A comunicação parece robótica?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Não. As mensagens são personalizadas com o nome do aluno, o horário que ele visitou e o objetivo que ele informou. A maioria dos prospects não percebe que é automatizado — e isso é intencional.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              Preciso trocar meu sistema de gestão?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Não. O HeyMax se conecta ao Evo e ao NextFit via API. Você continua usando tudo que já usa.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              Vai dar mais trabalho para minha recepção?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              O oposto. Sua recepção para de fazer follow-up manual e passa a receber leads já qualificados — quem já demonstrou interesse e está pronto para conversar.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-white/10 bg-white/5 rounded-2xl px-6 border-b-0">
            <AccordionTrigger className="text-base text-white hover:no-underline hover:text-primary transition-colors py-6">
              Quanto tempo leva para configurar?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-6">
              Minutos. Você passa sua chave da API do Evo ou NextFit, informa os dados básicos da academia e define o nome e tom da sua IA. O HeyMax começa a operar no mesmo dia.
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

        <h2 className="font-sans font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">Quantos prospects sua academia perdeu esse mês?</h2>
        <p className="font-sans text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
          O HeyMax recupera essa conversa automaticamente. Configure em minutos, veja o resultado em dias.
        </p>

        <button onClick={() => window.open('https://wa.me/5581999897501?text=Olá! Gostaria de agendar uma demonstração do HeyMax.fit', '_blank')} className="group relative overflow-hidden rounded-full bg-primary px-10 py-5 text-lg font-bold text-background transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_60px_rgba(0,230,96,0.4)] mx-auto inline-flex items-center gap-3">
          <span className="relative z-10 flex items-center gap-2">
            Agendar Demonstração Gratuita <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
            Tecnologia que retém. Resultado que aparece.
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
            <li><a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a></li>
            <li><a href="#protocol" className="hover:text-primary transition-colors">Como Funciona</a></li>
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-4 font-sans text-sm text-foreground/60">
            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-foreground/40">
        <p>&copy; {new Date().getFullYear()} HeyMax.fit. Todos os direitos reservados.</p>
        <p>HeyMax é uma marca da <a href="https://fluid-ti.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">Fluid Tecnologia e Inteligência</a> · fluid-ti.com</p>
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
      <PlatformSection />
      <Philosophy />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
