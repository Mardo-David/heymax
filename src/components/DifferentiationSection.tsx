import { motion } from "framer-motion";
import { Shield, Layers, Clock } from "lucide-react";

const differentiators = [
  {
    icon: Shield,
    title: "API Oficial vs. Ferramentas Amadoras",
    description: "Sem risco de banimento de número; utilizamos o canal oficial da Meta.",
  },
  {
    icon: Layers,
    title: "Não é substituição, é amplificação",
    description: "Não troque seu sistema de gestão (ERP); o Coach AI se acopla a ele para resolver a retenção.",
  },
  {
    icon: Clock,
    title: "Configuração Plug & Play",
    description: "Nossa equipe realiza o setup técnico inicial em 24 horas.",
  },
];

const DifferentiationSection = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-section mb-4">
            Mais do que um chatbot:{" "}
            <span className="text-gradient">uma camada de inteligência integrada</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
