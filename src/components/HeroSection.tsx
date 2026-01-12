import { MessageSquare, Cog, TrendingUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import WhatsAppMockup from "./WhatsAppMockup";

const benefits = [
  {
    icon: MessageSquare,
    title: "Taxa de abertura de 98%",
    description: "Enquanto e-mails são ignorados, o WhatsApp garante que sua mensagem seja lida em menos de 90 segundos.",
  },
  {
    icon: Cog,
    title: "Integração Nativa",
    description: "Conecte-se instantaneamente ao Tecnofit, Evo, Pacto ou Next Fit via API segura.",
  },
  {
    icon: TrendingUp,
    title: "Resultados em 30 dias",
    description: "Recupere alunos inativos e proteja seu caixa com inteligência artificial que aprende com seu público.",
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden hero-gradient">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Main Headline */}
            <h1 className="text-hero mb-6">
              Pare de perder alunos para o silêncio.{" "}
              <span className="text-gradient">Recupere sua receita com IA</span> no WhatsApp.
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              O assistente de IA que monitora frequências e conversa de forma humana 24/7.{" "}
              <strong className="text-foreground">Reduza o churn em até 30%</strong>.
            </p>

            {/* Benefits Grid */}
            <div className="grid gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" className="group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ver o Hey Max em Ação
              </Button>
              <Button variant="heroOutline" size="xl">
                Agendar Demonstração
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - WhatsApp Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <WhatsAppMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
