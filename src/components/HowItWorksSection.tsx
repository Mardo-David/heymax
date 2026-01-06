import { motion } from "framer-motion";
import { Search, MessageCircle, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Monitoramento",
    description: "Integração automática com Tecnofit, Evo, Pacto e Next Fit. A IA identifica alunos em risco de churn em tempo real.",
    highlight: "Sem configuração manual",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Conversa Humanizada",
    description: "Utilizando NLP avançado, o Coach AI mantém conversas empáticas e naturais que parecem vindas de um humano real.",
    highlight: "98% de taxa de abertura",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Ação Automática",
    description: "O aluno responde e a IA agenda aulas de retorno ou renova planos diretamente no seu painel de gestão.",
    highlight: "Conversão automatizada",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="section-spacing relative overflow-hidden bg-card">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Como Funciona
          </span>
          <h2 className="text-section mb-4">
            Três passos para <span className="text-gradient">zerar o churn</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Implementação rápida, resultados em dias.
          </p>
        </motion.div>

        {/* Z-Pattern Steps */}
        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col gap-8 items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="text-5xl md:text-6xl font-bold text-primary/20">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg mb-4 max-w-md">
                  {step.description}
                </p>
                <span className="inline-flex items-center gap-2 text-primary font-medium">
                  <ArrowRight className="w-4 h-4" />
                  {step.highlight}
                </span>
              </div>

              {/* Visual */}
              <div className="flex-1 w-full max-w-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl" />
                  <div className="relative bento-card p-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="h-2 bg-muted rounded-full mb-3">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(index + 1) * 33}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Passo {index + 1} de 3
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
