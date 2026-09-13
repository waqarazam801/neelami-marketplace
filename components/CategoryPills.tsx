'use client';

import React from 'react';
import { Category } from '../types/auction';
import { 
  Sparkles, 
  Watch, 
  Car, 
  Laptop, 
  Gem, 
  Building2, 
  Palette, 
  Trophy 
} from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts?: Record<string, number>;
}

export const CATEGORIES: { name: Category; icon: React.FC<{ className?: string }> }[] = [
  { name: 'All', icon: Sparkles },
  { name: 'Luxury Watches', icon: Watch },
  { name: 'Electronics & Gadgets', icon: Laptop },
  { name: 'Vehicles & Motors', icon: Car },
  { name: 'Antiques & Art', icon: Palette },
  { name: 'Jewelry & Gems', icon: Gem },
  { name: 'Real Estate & Land', icon: Building2 },
  { name: 'Collectibles', icon: Trophy },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map(({ name, icon: Icon }) => {
          const isSelected = selectedCategory === name;
          const count = categoryCounts[name];

          return (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
              <span>{name}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
