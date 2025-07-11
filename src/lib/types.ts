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
  model: string;
  serialNumber: string;
  barcode: string;
  status: 'available' | 'assigned' | 'maintenance';
  tags: string[];
  createdAt: Date;
}
