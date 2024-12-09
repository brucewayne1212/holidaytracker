import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase-config';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function FirestoreStatus() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing Firestore connection...');

  useEffect(() => {
    async function testFirestore() {
      try {
        // Try to add a test document
        const testDoc = await addDoc(collection(db, 'holidays'), {
          date: '2024-09-01',
          type: 'test',
          description: 'Test Connection',
          createdAt: new Date().toISOString()
        });

        // Clean up the test document
        await deleteDoc(testDoc);

        setStatus('success');
        setMessage('Firestore connection established successfully!');
      } catch (error) {
        console.error('Firestore test failed:', error);
        setStatus('error');
        setMessage(`Firestore error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    testFirestore();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-white">
      <div className="flex items-center gap-2">
        {status === 'testing' && (
          <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        <span className={
          status === 'success' ? 'text-green-700' :
          status === 'error' ? 'text-red-700' :
          'text-yellow-700'
        }>
          {message}
        </span>
      </div>
    </div>
  );
}