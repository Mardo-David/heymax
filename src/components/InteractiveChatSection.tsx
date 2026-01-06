import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoConversations = [
  {
    role: "bot",
    message: "Olá! Sou o Coach AI 🤖 Quer ver como eu falaria com seus alunos em risco?",
    delay: 0,
  },
  {
    role: "user",
    message: "Sim! Mostre como funciona",
    delay: 2000,
  },
  {
    role: "bot",
    message: "Perfeito! Veja um exemplo real de conversa com um aluno que não treina há 7 dias:",
    delay: 3500,
  },
  {
    role: "bot",
    message: "🏋️ \"Oi João! Sentimos sua falta aqui na academia. Tudo bem? Vi que faz 7 dias desde seu último treino. Posso te ajudar a agendar sua volta?\"",
    delay: 5000,
  },
  {
    role: "user",
    message: "Impressionante! Parece bem natural",
    delay: 7000,
  },
  {
    role: "bot",
    message: "Exatamente! Uso NLP avançado para conversas empáticas. Quando o João responde, já agendo o retorno automaticamente no seu sistema 📅",
    delay: 8500,
  },
];

const InteractiveChatSection = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startDemo = () => {
    setHasStarted(true);
    setVisibleMessages(1);
  };

  useEffect(() => {
    if (!hasStarted) return;

    if (visibleMessages < demoConversations.length) {
      const nextDelay =
        demoConversations[visibleMessages]?.delay -
        (demoConversations[visibleMessages - 1]?.delay || 0);

      setIsTyping(true);
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, nextDelay);

      return () => clearTimeout(typingTimeout);
    }
  }, [visibleMessages, hasStarted]);

  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Experimente Agora
          </span>
          <h2 className="text-section mb-4">
            Veja a IA <span className="text-gradient">em ação</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simule uma conversa e descubra como o Coach AI interage com seus alunos.
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Chat Window */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              {/* Chat Header */}
              <div className="bg-primary/10 px-4 py-3 flex items-center gap-3 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Coach AI</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Online agora
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {demoConversations.slice(0, visibleMessages).map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!hasStarted && (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-center">
                      Clique no botão abaixo para iniciar a demonstração
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                {!hasStarted ? (
                  <Button onClick={startDemo} variant="cta" className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    Iniciar Demonstração
                  </Button>
                ) : visibleMessages >= demoConversations.length ? (
                  <Button
                    onClick={() => {
                      setVisibleMessages(0);
                      setHasStarted(false);
                    }}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Reiniciar Demo
                  </Button>
                ) : (
                  <div className="flex gap-2 items-center bg-muted rounded-xl px-4 py-2">
                    <input
                      type="text"
                      placeholder="A IA está respondendo..."
                      className="flex-1 bg-transparent text-sm outline-none"
                      disabled
                    />
                    <Send className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveChatSection;
