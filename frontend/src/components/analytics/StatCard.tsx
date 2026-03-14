import React from 'react';
import {type LucideIcon } from 'lucide-react';

/**
 * Prop definitions for the StatCard component.
 * 'colorClass' should be a valid Tailwind background/text color class.
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass 
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${colorClass}`}>
          {/* Using the Icon as a component with proper typing */}
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;