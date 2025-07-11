
'use client';

import type { Equipment } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EquipmentContextType {
  equipmentList: Equipment[];
  recentlyAdded: Equipment[];
  addEquipment: (item: Omit<Equipment, 'id' | 'status' | 'createdAt'>) => void;
  loading: boolean;
}

const EquipmentContext = createContext<EquipmentContextType | null>(null);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const addEquipment = (item: Omit<Equipment, 'id' | 'status' | 'createdAt'>) => {
    const newEquipment: Equipment = {
      ...item,
      id: `local-${Date.now()}-${Math.random()}`, // Unique local ID
      status: 'available',
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    };
    
    setEquipmentList((prev) => [...prev, newEquipment]);
    setRecentlyAdded((prev) => [newEquipment, ...prev]);
  };

  const value = {
    equipmentList,
    recentlyAdded,
    addEquipment,
    loading
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};
