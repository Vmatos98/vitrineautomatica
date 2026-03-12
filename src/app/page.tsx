import { neon } from '@neondatabase/serverless';
import { Youtube, Smartphone, Sparkles } from 'lucide-react';
import VitrineClient from '@/components/VitrineClient';

// Forçamos a página a renderizar no lado do servidor a cada requisição para sempre pegar novos produtos
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Conectar ao Neon DataBase
  const sql = neon(process.env.DATABASE_URL!);
  
  // Buscar os dados organizadamente do banco via Server Components!
  const categorias = await sql`SELECT * FROM categorias ORDER BY nome ASC`;
  const produtos = await sql`SELECT id, produto, url, imagem_capa, descricao, shop, id_categoria FROM produtos_links ORDER BY imagens DESC`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* HEADER / PERFIL */}
      <header className="relative pt-12 pb-10 px-4 text-center z-10 w-full animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div className="absolute inset-0 h-48 bg-gradient-to-b from-indigo-100/50 to-transparent dark:from-indigo-900/20 dark:to-transparent -z-10" />
        
        <div className="max-w-3xl mx-auto">
          {/* Avatar Area */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50 group-hover:opacity-80" />
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-300 bg-[#1a1b2e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Achei Comprei Links Logo" 
                className="w-full h-full object-cover scale-[1.25]"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            Achei Comprei Links <Sparkles className="text-indigo-500 w-5 h-5 animate-pulse" />
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
            Encontre aqui todos os produtos e achadinhos que eu recomendo nos meus vídeos do TikTok e YouTube! 👇
          </p>

          {/* Redes Sociais */}
          <div className="flex justify-center gap-4 mb-2">
            {[
              { icon: Youtube, color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400", label: "YouTube", href: "https://youtube.com/@achei_comprei_ofertas?si=IGF524sF7GfM10M7" },
              { icon: Smartphone, color: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/20 dark:hover:text-white", label: "TikTok", href: "https://www.tiktok.com/@achei_comprei_ofertas?_r=1&_t=ZS-94dfBDfovMy" }
            ].map((Social, i) => (
              <a 
                key={i}
                href={Social.href} 
                target="_blank"
                rel="noopener noreferrer"
                title={Social.label}
                className={`p-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm rounded-full text-slate-600 dark:text-slate-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${Social.color}`}
              >
                <Social.icon size={22} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* COMPONENTE CLIENTE - Lista e Filtros */}
      {/* Passamos os dados do banco como propriedades para o React montar do lado do cliente */}
      <VitrineClient 
        initialProducts={produtos as any} 
        initialCategories={categorias as any} 
      />

      {/* FOOTER */}
      <footer className="mt-20 text-center text-sm px-4 relative z-10">
        <div className="max-w-3xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8 pb-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">
            © {new Date().getFullYear()} Achei Comprei Links. Todos os direitos reservados.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-6">
            Aviso: Comprando pelos links acima, eu posso receber uma pequena comissão sem custo adicional para você. 💙
          </p>

          <a 
            href="https://automatas.tech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-[background-color] duration-300 border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            Quer automatizar suas vendas? Acesse <span className="underline decoration-indigo-300 dark:decoration-indigo-500/50 underline-offset-2">automatas.tech</span> 🚀
          </a>
        </div>
      </footer>
    </div>
  );
}
