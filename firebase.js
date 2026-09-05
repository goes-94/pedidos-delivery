console.log("firebase.js carregado");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0DivZNFzsBTF_5GEuPKXr9DYv7ynsuE8",
  authDomain: "pizzaria-pedidos-4ea9b.firebaseapp.com",
  projectId: "pizzaria-pedidos-4ea9b",
  storageBucket: "pizzaria-pedidos-4ea9b.appspot.com", // corrigido
  messagingSenderId: "154219434950",
  appId: "1:154219434950:web:11fb6b5259a2b97332d8c7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pedidosRef = collection(db, "pedidos");

async function salvarPedido(pedido) {
  const referencia = await addDoc(pedidosRef, {
    ...pedido,
    criadoEm: serverTimestamp(),
  });
  return referencia.id;
}

function ouvirPedidos(callback, aoErro = console.error) {
  const consulta = query(pedidosRef, orderBy("criadoEm", "desc"));
  return onSnapshot(
    consulta,
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    aoErro,
  );
}

async function atualizarStatusPedido(id, status) {
  await updateDoc(doc(db, "pedidos", id), { status });
}

window.firebasePedidos = { salvarPedido, ouvirPedidos, atualizarStatusPedido };
export { db, salvarPedido, ouvirPedidos, atualizarStatusPedido };
