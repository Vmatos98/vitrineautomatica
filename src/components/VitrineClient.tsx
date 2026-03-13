"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShoppingBag, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

interface Produto {
  id: string;
  produto: string;
  url: string;
  imagem_capa: string | null;
  descricao: string | null;
  shop: string | null;
  id_categoria: string | null;
}

interface VitrineClientProps {
  initialProducts: Produto[];
  initialCategories: Categoria[];
}

export default function VitrineClient({ initialProducts, initialCategories }: VitrineClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Reset pagination when using filters
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // Preparar a lista de categorias pra exibir (Adicionando "Todos" e mapeando os nomes)
  const categoriesList = useMemo(() => {
    const cats = new Set(initialCategories.map(c => c.nome));
    return ['Todos', ...Array.from(cats)];
  }, [initialCategories]);

  // Filtrar produtos com base na busca e categoria
  const filteredProducts = useMemo(() => {
    // Helper function to remove accents and normalize string for better matching
    const normalizeString = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    const normalizedSearch = normalizeString(searchTerm);

    return initialProducts.filter(p => {
      const normalizedProduct = normalizeString(p.produto);
      const normalizedDesc = normalizeString(p.descricao || '');

      const matchSearch = 
        normalizedProduct.includes(normalizedSearch) || 
        normalizedDesc.includes(normalizedSearch);
      
      const catObj = initialCategories.find(c => c.id === p.id_categoria);
      const catName = catObj ? catObj.nome : 'Sem Categoria';

      const matchCategory = activeCategory === 'Todos' || catName === activeCategory;
      
      return matchSearch && matchCategory;
    });
  }, [searchTerm, activeCategory, initialProducts, initialCategories]);

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Helper para buscar o nome da categoria para a badge do produto
  const getCategoryName = (catId: string | null) => {
    const cat = initialCategories.find(c => c.id === catId);
    return cat ? cat.nome : 'Diversos';
  };

  return (
    <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 z-10 relative transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      
      <div className="sticky top-4 z-30 max-w-2xl mx-auto mb-10 pt-2">
        {/* Barra de Pesquisa Glassmorphism */}
        <div className="relative group shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-white/20 dark:border-slate-700/50 rounded-2xl leading-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-base transition-all"
            placeholder="Buscar por fone, ring light, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap py-2 mb-10 gap-3 justify-start md:justify-center px-2">
        {categoriesList.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
              activeCategory === category
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgb(99,102,241,0.23)] hover:-translate-y-0.5'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length > 0 ? (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.map((product, idx) => (
              <Link
                href={`/produto/${product.id}`}
                key={product.id} 
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Imagem do Produto */}
                <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse -z-10" />
                  {product.imagem_capa ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={product.imagem_capa} 
                      alt={product.produto} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Sem Imagem
                    </div>
                  )}
                  
                  {/* Overlay gradiente para contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge da Plataforma */}
                  <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:scale-105">
                    {(product.shop?.toLowerCase() === 'shopee') ? (
                      <span className="bg-gradient-to-r from-[#ee4d2d] to-[#ff7337] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                        Shopee
                      </span>
                    ) : (product.shop?.toLowerCase() === 'mercado livre' || product.shop?.toLowerCase() === 'mercadolivre') ? (
                      <span className="bg-gradient-to-r from-[#ffe600] to-[#fff36b] text-[#2d3277] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                        Mercado Livre
                      </span>
                    ) : product.shop ? (
                      <span className="bg-gradient-to-r from-slate-700 to-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                        {product.shop}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-500 dark:text-indigo-400 mb-2 block">
                      {getCategoryName(product.id_categoria)}
                    </span>
                    <h3 className="font-bold text-xl leading-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.produto}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                    {product.descricao || 'Nenhuma descrição fornecida.'}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Botão de Compra com link de afiliado */}
                    {/* Alteramos de tag <a> para renderizar como um botão que impede propagação caso queiramos ir pra loja invés do link de detalhes */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); 
                        window.open(product.url, '_blank');
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/btn ${
                        product.shop?.toLowerCase() === 'shopee' 
                          ? 'bg-gradient-to-r from-[#ee4d2d] to-[#ff7337]' 
                          : product.shop?.toLowerCase().includes('mercado')
                          ? 'bg-gradient-to-r from-[#2d3277] to-[#454baa]'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                      <ShoppingBag size={18} className="relative z-10" />
                      <span className="relative z-10">
                        {product.shop?.toLowerCase() === 'shopee'
                          ? 'Confira na shopee'
                          : product.shop?.toLowerCase().includes('mercado')
                          ? 'Ver no Mercado Livre'
                          : 'Comprar Agora'}
                      </span>
                      <ExternalLink size={16} className="relative z-10 opacity-70 ml-1" />
                    </button>
                  </div>
                </div>
              </Link>
          ))}
        </div>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Página anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_4px_14px_0_rgb(99,102,241,0.39)]'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-slate-400 dark:text-slate-500">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Próxima página"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
        </>
      ) : (
        /* Estado Vazio (Nenhum produto encontrado) */
        <div className="text-center py-20 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 max-w-2xl mx-auto shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="h-8 w-8 text-slate-400 dark:text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum achadinho por aqui...</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Tente buscar por outro termo ou remova os filtros atuais.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('Todos');
            }}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
          >
            Limpar busca
          </button>
        </div>
      )}

    </main>
  );
}
