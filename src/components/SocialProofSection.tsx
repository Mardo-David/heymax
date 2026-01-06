import { motion } from "framer-motion";
import { Shield, CheckCircle2, Quote } from "lucide-react";

const logos = ["Tecnofit", "Evo", "Pacto", "Next Fit", "Wellhub"];

const badges = [
  { icon: Shield, text: "Meta Business Partner" },
  { icon: CheckCircle2, text: "LGPD Compliant" },
  { icon: Shield, text: "SSL Secured" },
];

const SocialProofSection = () => {
  return (
    <section className="section-spacing bg-card relative overflow-hidden">
      <div className="container-tight relative z-10">
        {/* Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
            Integração nativa com os principais sistemas
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-xl md:text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bento-card relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />
            <div className="pt-8 pl-8">
              <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                "Recuperei{" "}
                <span className="text-primary font-bold">8 alunos na primeira semana</span>{" "}
                com o Coach AI. Receita salva:{" "}
                <span className="text-primary font-bold">R$ 3.200,00/mês</span>"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">DA</span>
                </div>
                <div>
                  <p className="font-semibold">Dono de Academia</p>
                  <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {badges.map((badge, index) => (
            <div key={badge.text} className="trust-badge">
              <badge.icon className="w-4 h-4 text-primary" />
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
        >
          O Coach AI utiliza a <strong className="text-foreground">API oficial do WhatsApp Business</strong> para garantir criptografia e segurança total dos dados dos seus alunos.
        </motion.p>
      </div>
    </section>
  );
};

export default SocialProofSection;
