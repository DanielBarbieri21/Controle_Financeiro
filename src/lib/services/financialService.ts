import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { FinancialItem, ItemType, Category } from '@/types';

const COLLECTION_NAME = 'financialItems';

// Converter Firestore Timestamp para Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

// Converter FinancialItem para formato Firestore
const toFirestore = (item: Omit<FinancialItem, 'id'>): any => {
  return {
    ...item,
    date: item.date instanceof Date ? Timestamp.fromDate(item.date) : Timestamp.fromDate(new Date(item.date)),
    createdAt: item.createdAt instanceof Date ? Timestamp.fromDate(item.createdAt) : Timestamp.fromDate(new Date(item.createdAt)),
    updatedAt: item.updatedAt instanceof Date ? Timestamp.fromDate(item.updatedAt) : Timestamp.fromDate(new Date(item.updatedAt)),
  };
};

// Converter documento Firestore para FinancialItem
const fromFirestore = (doc: any): FinancialItem => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: convertTimestamp(data.date),
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

// Usar localStorage como fallback quando Firebase não estiver configurado
const useLocalStorage = () => {
  const STORAGE_KEY = 'financialItems';
  
  const getItems = (): FinancialItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const items = JSON.parse(stored);
      return items.map((item: any) => ({
        ...item,
        date: new Date(item.date),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    } catch {
      return [];
    }
  };

  const saveItems = (items: FinancialItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  return { getItems, saveItems };
};

// Verificar se Firebase está configurado
const isFirebaseConfigured = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-key';
};

export const financialService = {
  // Criar novo item
  async create(item: Omit<FinancialItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialItem> {
    const now = new Date();
    const newItem: Omit<FinancialItem, 'id'> = {
      ...item,
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), toFirestore(newItem));
        return { ...newItem, id: docRef.id };
      } catch (error) {
        console.error('Error creating item:', error);
        throw error;
      }
    } else {
      // Fallback para localStorage
      const { getItems, saveItems } = useLocalStorage();
      const items = getItems();
      const id = crypto.randomUUID();
      const createdItem = { ...newItem, id };
      items.push(createdItem);
      saveItems(items);
      return createdItem;
    }
  },

  // Atualizar item
  async update(id: string, item: Partial<FinancialItem>): Promise<void> {
    const updateData = {
      ...item,
      updatedAt: new Date(),
    };

    if (isFirebaseConfigured()) {
      try {
        const itemRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(itemRef, toFirestore(updateData as Omit<FinancialItem, 'id'>));
      } catch (error) {
        console.error('Error updating item:', error);
        throw error;
      }
    } else {
      // Fallback para localStorage
      const { getItems, saveItems } = useLocalStorage();
      const items = getItems();
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updateData, updatedAt: new Date() };
        saveItems(items);
      }
    }
  },

  // Deletar item
  async delete(id: string): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
      }
    } else {
      // Fallback para localStorage
      const { getItems, saveItems } = useLocalStorage();
      const items = getItems().filter(i => i.id !== id);
      saveItems(items);
    }
  },

  // Buscar todos os itens
  async getAll(filters?: {
    type?: ItemType;
    category?: Category;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<FinancialItem[]> {
    if (isFirebaseConfigured()) {
      try {
        const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
        
        if (filters?.type) {
          constraints.push(where('type', '==', filters.type));
        }
        if (filters?.category) {
          constraints.push(where('category', '==', filters.category));
        }
        if (filters?.startDate) {
          constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)));
        }
        if (filters?.endDate) {
          constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)));
        }

        const q = query(collection(db, COLLECTION_NAME), ...constraints);
        const querySnapshot = await getDocs(q);
        let items = querySnapshot.docs.map(fromFirestore);

        // Filtro de busca (client-side)
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          items = items.filter(item =>
            item.name.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        return items;
      } catch (error) {
        console.error('Error fetching items:', error);
        return [];
      }
    } else {
      // Fallback para localStorage
      const { getItems } = useLocalStorage();
      let items = getItems();

      if (filters?.type) {
        items = items.filter(i => i.type === filters.type);
      }
      if (filters?.category) {
        items = items.filter(i => i.category === filters.category);
      }
      if (filters?.startDate) {
        items = items.filter(i => new Date(i.date) >= filters.startDate!);
      }
      if (filters?.endDate) {
        items = items.filter(i => new Date(i.date) <= filters.endDate!);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  },

  // Buscar item por ID
  async getById(id: string): Promise<FinancialItem | null> {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return fromFirestore(docSnap);
        }
        return null;
      } catch (error) {
        console.error('Error fetching item:', error);
        return null;
      }
    } else {
      // Fallback para localStorage
      const { getItems } = useLocalStorage();
      const items = getItems();
      return items.find(i => i.id === id) || null;
    }
  },
};

