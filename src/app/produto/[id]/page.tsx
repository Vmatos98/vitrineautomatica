import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import ProductGallery from './ProductGallery';

// Forçamos a página a renderizar no lado do servidor a cada requisição
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoInterno({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  if (!productId) {
    notFound();
  }

  // Conectar ao Neon DataBase
  const sql = neon(process.env.DATABASE_URL!);
  
  // Buscar os dados do produto específico e sua categoria
  const result = await sql`
    SELECT 
      p.id, p.produto, p.url, p.imagem_capa, p.descricao, p.imagens, p.shop,
      c.nome as categoria_nome
    FROM produtos_links p
    LEFT JOIN categorias c ON p.id_categoria = c.id
    WHERE p.id = ${productId}
  `;

  if (!result || result.length === 0) {
    notFound();
  }

  const product = result[0];
  
  // Parse da coluna imagens se for JSON array (ou string separada por vírgula)
  let galleryImages: string[] = [];
  if (product.imagens) {
    try {
      // Tenta parsear como JSON
      const parsed = JSON.parse(product.imagens);
      if (Array.isArray(parsed)) {
        galleryImages = parsed;
      }
    } catch {
      // Se falhar o parse JSON, assume que pode ser separado por vírgulas
      galleryImages = product.imagens.split(',').map((u: string) => u.trim()).filter(Boolean);
    }
  }
  
  // Garantir que a imagem de capa seja sempre a primeira da galeria
  if (product.imagem_capa && !galleryImages.includes(product.imagem_capa)) {
    galleryImages.unshift(product.imagem_capa);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden pb-24">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Navbar Minimalista */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
              <ArrowLeft size={18} />
            </div>
            Voltar para a vitrine
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 z-10 relative">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            {/* Esquerda: Galeria de Imagens (Client Component) */}
            <div className="p-6 lg:p-10 lg:pr-4">
              <ProductGallery images={galleryImages} altText={product.produto} />
            </div>

            {/* Direita: Informações do Produto */}
            <div className="p-6 lg:p-10 lg:pl-6 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/50">
              
              <div className="mb-8">
                {/* Badge Categoria */}
                <span className="inline-block px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-xl mb-4 border border-indigo-100/50 dark:border-indigo-500/20">
                  {product.categoria_nome || 'Diversos'}
                </span>
                
                {/* Título Principal */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6 tracking-tight">
                  {product.produto}
                </h1>

                {/* Loja / Plataforma */}
                {product.shop && (
                  <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Vendido e entregue por: 
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {product.shop}
                    </span>
                  </div>
                )}
                
                <div className="w-16 h-1 bg-indigo-500 rounded-full mb-6"></div>

                {/* Descrição */}
                <div className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400">
                  <p className="whitespace-pre-wrap">{product.descricao || 'Nenhuma descrição fornecida para este item.'}</p>
                </div>
              </div>

              {/* Botão de Compra Principal CTA */}
              <div className="mt-8 space-y-4">
                <a 
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgb(99,102,241,0.4)] transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/btn ${
                    product.shop?.toLowerCase() === 'shopee' 
                      ? 'bg-gradient-to-r from-[#ee4d2d] to-[#ff7337]' 
                      : product.shop?.toLowerCase().includes('mercado')
                      ? 'bg-gradient-to-r from-[#2d3277] to-[#454baa]'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  <ShoppingBag size={24} className="relative z-10" />
                  <span className="relative z-10 tracking-wide">
                    {product.shop?.toLowerCase() === 'shopee'
                      ? 'Confira na shopee'
                      : product.shop?.toLowerCase().includes('mercado')
                      ? 'Ver no Mercado Livre'
                      : 'Comprar Agora na Loja'}
                  </span>
                  <ExternalLink size={20} className="relative z-10 opacity-70 ml-1" />
                </a>

                {/* Badges de Confiança */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span>Compra 100% Segura</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={16} className="text-blue-500" />
                    <span>Entrega Garantida</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
