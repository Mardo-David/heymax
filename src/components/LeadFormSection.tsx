import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle, Shield, Clock, Users } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  { icon: Clock, text: "Setup em menos de 24h" },
  { icon: Shield, text: "API Oficial Meta" },
  { icon: Users, text: "Suporte dedicado" },
];

const LeadFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    academyName: "",
    studentCount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Solicitação enviada com sucesso! Entraremos em contato em breve.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <section id="contato" className="section-spacing bg-card relative overflow-hidden">
        <div className="container-tight relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Recebemos sua solicitação!</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe entrará em contato pelo WhatsApp em até 24 horas para agendar sua demonstração personalizada.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", whatsapp: "", academyName: "", studentCount: "" });
              }}
            >
              Enviar nova solicitação
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contato" className="section-spacing bg-card relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Comece Agora
            </span>
            <h2 className="text-section mb-4">
              Agende sua <span className="text-gradient">demonstração gratuita</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Preencha o formulário e nossa equipe entrará em contato para mostrar como o Hey Max pode revolucionar a retenção da sua academia.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bento-card p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Seu Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Como podemos te chamar?"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academyName">Nome da Academia *</Label>
                <Input
                  id="academyName"
                  name="academyName"
                  placeholder="Ex: Academia Power Fit"
                  value={formData.academyName}
                  onChange={handleChange}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCount">Número de Alunos *</Label>
                <select
                  id="studentCount"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione...</option>
                  <option value="0-100">Até 100 alunos</option>
                  <option value="100-300">100 a 300 alunos</option>
                  <option value="300-500">300 a 500 alunos</option>
                  <option value="500-1000">500 a 1.000 alunos</option>
                  <option value="1000+">Mais de 1.000 alunos</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Agendar Minha Demonstração
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Ao enviar, você concorda com nossa{" "}
                <a href="#" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadFormSection;
