
export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'admin' | 'technician';
  dni?: string;
}

export interface Equipment {
  id: string;
  type: string;
  serialNumber: string;
  quantity: number;
  status: 'disponible' | 'asignado' | 'mantenimiento';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
