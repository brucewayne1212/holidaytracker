import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase-config';
import { Holiday, HolidayType } from '../types/holiday';
import { format } from 'date-fns';
import { ACADEMIC_YEAR } from '../lib/constants';
import { getWorkingDaysInRange } from '../lib/utils';

export function useHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const holidaysRef = collection(db, 'holidays');
    const q = query(
      holidaysRef,
      where('date', '>=', ACADEMIC_YEAR.START),
      where('date', '<=', ACADEMIC_YEAR.END),
      orderBy('date', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loadedHolidays: Holiday[] = [];
        snapshot.forEach((doc) => {
          loadedHolidays.push({ id: doc.id, ...doc.data() } as Holiday);
        });
        setHolidays(loadedHolidays);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching holidays:', err);
        setError('Failed to load holidays');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addHoliday = async (date: Date, type: HolidayType, description: string) => {
    try {
      const holiday: Omit<Holiday, 'id'> = {
        date: format(date, 'yyyy-MM-dd'),
        type,
        description,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'holidays'), holiday);
      return docRef.id;
    } catch (err) {
      console.error('Error adding holiday:', err);
      throw new Error('Failed to add holiday');
    }
  };

  const addHolidayRange = async (start: Date, end: Date, type: HolidayType, description: string) => {
    try {
      const workingDays = getWorkingDaysInRange(start, end);
      
      const batch = [];
      for (const date of workingDays) {
        const holiday: Omit<Holiday, 'id'> = {
          date: format(date, 'yyyy-MM-dd'),
          type,
          description: `${description} (Part of range booking)`,
          createdAt: new Date().toISOString()
        };
        batch.push(addDoc(collection(db, 'holidays'), holiday));
      }

      await Promise.all(batch);
    } catch (err) {
      console.error('Error adding holiday range:', err);
      throw new Error('Failed to add holiday range');
    }
  };

  return {
    holidays,
    loading,
    error,
    addHoliday,
    addHolidayRange
  };
}