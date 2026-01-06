import { motion } from "framer-motion";
import { Brain, MessageCircle, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Monitoramento Inteligente",
    description: "A IA identifica automaticamente alunos em risco (ex: 7 dias sem check-in) lendo os dados do seu ERP em tempo real.",
    size: "large",
  },
  {
    icon: MessageCircle,
    title: "Conversa Humanizada",
    description: "Utiliza Processamento de Linguagem Natural (NLP) para manter conversas fluidas, empáticas e indistinguíveis de um humano.",
    size: "large",
  },
  {
    icon: Zap,
    title: "Ação e Resultado Automáticos",
    description: "O aluno responde e a IA já agenda a aula de retorno ou renova o plano diretamente no seu painel.",
    size: "small",
  },
  {
    icon: Users,
    title: "Foco no Relacionamento",
    description: "Libere seus instrutores da logística repetitiva para focarem no atendimento pessoal no chão da academia.",
    size: "small",
  },
];

const SolutionSection = () => {
  return (
    <section id="integracoes" className="section-spacing relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-section mb-4">
            Seu Novo Gerente de Retenção Trabalha{" "}
            <span className="text-gradient">24 Horas por Dia</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta que cuida dos seus alunos enquanto você foca no crescimento.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bento-card ${feature.size === 'large' ? 'lg:col-span-2' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
