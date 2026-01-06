import { motion } from "framer-motion";
import { AlertTriangle, Mail, UserX } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "O Churn Invisível",
    text: "Alunos param de frequentar semanas antes de cancelar oficialmente e você só percebe quando o pagamento falha.",
  },
  {
    icon: Mail,
    title: "A Irrelevância do E-mail",
    text: "Tentar reativar alunos por e-mail é \"falar com as paredes\", com taxas de abertura abaixo de 20%.",
  },
  {
    icon: UserX,
    title: "A Sobrecarga da Recepção",
    text: "Sua recepção está exausta e não consegue enviar centenas de mensagens personalizadas por dia.",
  },
];

const ProblemsSection = () => {
  return (
    <section className="section-spacing bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-section mb-4">
            A <span className="text-accent">"Fuga Silenciosa"</span> está drenando seu lucro?
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bento-card group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <problem.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {problem.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
