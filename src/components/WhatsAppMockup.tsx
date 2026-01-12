import { motion } from "framer-motion";
import logo from "@/assets/HeyMaxfitV.png";

const WhatsAppMockup = () => {
  return (
    <div className="relative">
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
      
      {/* Phone frame */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-72 md:w-80"
      >
        {/* Phone outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-gray-700 to-gray-900 p-2 shadow-2xl">
          {/* Phone screen */}
          <div className="rounded-[2.5rem] bg-gray-900 overflow-hidden">
            {/* Notch */}
            <div className="flex justify-center pt-2">
              <div className="w-24 h-6 bg-black rounded-full" />
            </div>
            
            {/* WhatsApp UI */}
            <div className="bg-[#0b141a] min-h-[500px]">
              {/* WhatsApp Header - more authentic */}
              <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Coach AI" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">HeyMax.fit</p>
                  <p className="text-xs text-primary">online</p>
                </div>
                <div className="flex gap-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              {/* Chat background pattern */}
              <div className="relative min-h-[420px] p-3" style={{ backgroundColor: '#0b141a', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                
                {/* Date badge */}
                <div className="flex justify-center mb-3">
                  <span className="bg-[#1d282f] text-gray-400 text-[10px] px-3 py-1 rounded-lg">HOJE</span>
                </div>

                {/* Chat Messages */}
                <div className="space-y-2">
                  {/* AI Message 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-white text-[13px] leading-relaxed">
                        E aí João! 👋 Sentimos sua falta na academia...
                      </p>
                      <p className="text-gray-500 text-[10px] text-right mt-0.5">10:32</p>
                    </div>
                  </motion.div>

                  {/* AI Message 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-white text-[13px] leading-relaxed">
                        Lembra da sua meta de perder 5kg até março? 🎯 Faltam só 2kg! Seria uma pena parar agora.
                      </p>
                      <p className="text-gray-500 text-[10px] text-right mt-0.5">10:32</p>
                    </div>
                  </motion.div>

                  {/* User Response */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.1 }}
                    className="flex justify-end"
                  >
                    <div className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-white text-[13px] leading-relaxed">
                        É verdade! Tive uma semana difícil, mas vou voltar amanhã 💪
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <p className="text-gray-400 text-[10px]">10:35</p>
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" transform="translate(4, 0)"/>
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Motivation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-white text-[13px] leading-relaxed">
                        Isso aí! 🔥 Você está tão perto. Te vejo amanhã então! O resultado vai valer a pena. 🏆
                      </p>
                      <p className="text-gray-500 text-[10px] text-right mt-0.5">10:35</p>
                    </div>
                  </motion.div>

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 3.5, duration: 2, repeat: Infinity }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#202c33] rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* WhatsApp input bar */}
              <div className="bg-[#1f2c34] px-2 py-2 flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
                  <p className="text-gray-500 text-sm">Mensagem</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="h-6 bg-black flex items-center justify-center">
              <div className="w-32 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppMockup;
