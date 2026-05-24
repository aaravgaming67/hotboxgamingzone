import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjJaKI6SXNRlTMhrKIGcDVNOVHUxsjEO4",
  authDomain: "hotboxgaming-51dc2.firebaseapp.com",
  databaseURL: "https://hotboxgaming-51dc2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hotboxgaming-51dc2",
  storageBucket: "hotboxgaming-51dc2.firebasestorage.app",
  messagingSenderId: "167301436788",
  appId: "1:167301436788:web:8ca699ceab337408060821",
  measurementId: "G-1ZFGY4BJW2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize analytics safely (does not crash if indexedDB or analytics are blocked/unsupported)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Firebase Analytics initialization skipped/unsupported:", err);
  }
}

// Initialize Firestore with long polling to ensure reliable connections in sandboxed previews
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Settle active testing of server context
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
