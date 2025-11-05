import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// As variáveis globais __firebase_config e __app_id são injetadas pelo ambiente.
// Usamos a configuração padrão que você forneceu caso elas não estejam disponíveis.
const defaultFirebaseConfig = {
    apiKey: "AIzaSyAOM2DZtGiJ88eDzI_IoInx4YLzxD6kE0k",
    authDomain: "praxiscapital-3cfdb.firebaseapp.com",
    projectId: "praxiscapital-3cfdb",
    storageBucket: "praxiscapital-3cfdb.firebasestorage.app",
    messagingSenderId: "39603192567",
    appId: "1:39603192567:web:0962b3ed01aa93898309f2",
    measurementId: "G-7H40NTJB7W"
};

// Usa a config injetada pelo ambiente, ou a sua config padrão
const firebaseConfig = (typeof __firebase_config !== 'undefined' && __firebase_config) 
    ? JSON.parse(__firebase_config) 
    : defaultFirebaseConfig;

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar os serviços
const db = getFirestore(app);
const auth = getAuth(app);

// O app ID também é injetado pelo ambiente
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'praxiscapital-default';

// Exportar instâncias
export { db, auth };