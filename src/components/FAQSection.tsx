import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Funciona com meu sistema?",
    answer: "Sim, integração nativa via API com os principais ERPs do mercado: Tecnofit, Evo, Pacto, Next Fit e muitos outros.",
  },
  {
    question: "O WhatsApp bloqueia o número?",
    answer: "Não, pois operamos via API Oficial Business da Meta. Sem riscos de banimento.",
  },
  {
    question: "É difícil configurar?",
    answer: "Não, é um sistema \"Plug & Play\" com suporte completo na implementação. Nossa equipe cuida de todo o setup técnico em até 24 horas.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim, seguimos rigorosamente a LGPD com criptografia de ponta a ponta. Somos Meta Business Partners e utilizamos conexões SSL.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-spacing bg-card">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-section mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre o Coach AI Gym
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bento-card border-none px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
