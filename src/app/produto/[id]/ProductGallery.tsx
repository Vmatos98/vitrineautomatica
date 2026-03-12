"use client";

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  altText: string;
}

export default function ProductGallery({ images, altText }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '');

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
        <span className="text-slate-400 font-medium">Sem imagem disponível</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal */}
      <div className="relative w-full aspect-square rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-700/50 group">
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse -z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={mainImage} 
          alt={altText} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                mainImage === img 
                  ? 'border-indigo-500 shadow-md scale-105' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-indigo-300 dark:hover:border-indigo-500/50'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img} 
                alt={`Miniatura ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
