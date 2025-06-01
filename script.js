import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHNImx1Be-akVRcPpwUNTy87A6b1TxveE",
    authDomain: "cancioneshitster.firebaseapp.com",
    projectId: "cancioneshitster",
    storageBucket: "cancioneshitster.firebasestorage.app",
    messagingSenderId: "518062114537",
    appId: "1:518062114537:web:855b9f68ceb7eff9679278",
    measurementId: "G-BNMMCDP9Q9"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);


function mostrarReglas() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("reglas").style.display = "block";
  }
  
  function mostrarEscaner() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("escaner").style.display = "block";
  
    // 1. Solicitar permiso a la cámara
  navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
    // 2. Si se aceptó el permiso, iniciar el escáner
    iniciarEscaner();
  }).catch(err => {
    // 3. Si el usuario no da permiso
    document.getElementById("qr-result").innerText = "Permiso de cámara denegado.";
    console.error("Permiso denegado o error:", err);
  });

  }
  
  function volverAlMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("reglas").style.display = "none";
    document.getElementById("escaner").style.display = "none";
  }
  
  function iniciarEscaner() {
    const qrResult = document.getElementById("qr-result");
    qrResult.innerText = "";
    const html5QrCode = new Html5Qrcode("qr-reader");
  
    html5QrCode.start(
      { facingMode: { exact: "environment" } },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await html5QrCode.stop();
        qrResult.innerText = "Reproduciendo canción...";
  
        // Buscar canción en Firestore
        try {
          const docRef = doc(db, "canciones", decodedText);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            const url = data.url;
  
            const audio = new Audio(url);
            audio.autoplay = true;
            await audio.play();
          } else {
            qrResult.innerText = "No se encontró esa canción.";
          }
        } catch (e) {
          qrResult.innerText = "Error al buscar la canción.";
          console.error(e);
        }
      },
      (error) => {
        console.warn(`No se detectó un QR: ${error}`);
      }
    ).catch(err => {
      qrResult.innerText = `No se pudo iniciar la cámara: ${err}`;
    });
  }
  
  
