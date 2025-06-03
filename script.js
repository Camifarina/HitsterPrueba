let currentAudio = null;

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHNImx1Be-akVRcPpwUNTy87A6b1TxveE",
  authDomain: "cancioneshitster.firebaseapp.com",
  projectId: "cancioneshitster",
  storageBucket: "cancioneshitster.firebasestorage.app",
  messagingSenderId: "518062114537",
  appId: "1:518062114537:web:855b9f68ceb7eff9679278",
  measurementId: "G-BNMMCDP9Q9"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.addEventListener("DOMContentLoaded", () => {
  mostrarPantalla("pantalla-inicial");
  setTimeout(() => mostrarPantalla("menu"), 2000);
});

// Vinculamos botones del menú
document.querySelector(".btn-reglas").addEventListener("click", mostrarReglas);
document.querySelector(".btn-escanear").addEventListener("click", mostrarEscaner);

// Vinculamos todos los botones "Volver al menú"
document.querySelectorAll(".btn-volver").forEach(btn => {
  btn.addEventListener("click", volverAlMenu);
});

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.add("pantalla-oculta"));
  document.getElementById(id).classList.remove("pantalla-oculta");
}

function mostrarReglas() {
  mostrarPantalla("reglas");
}

function mostrarEscaner() {
  mostrarPantalla("escaner");
  navigator.mediaDevices.getUserMedia({ video: true }).then(() => iniciarEscaner()).catch(err => {
    alert("Permiso de cámara denegado.");
    console.error(err);
  });
}

function iniciarEscaner() {
  const html5QrCode = new Html5Qrcode("qr-reader");

  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    async (decodedText) => {
      await html5QrCode.stop();
      const docRef = db.collection("canciones").doc(decodedText);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data();
        currentAudio = new Audio(data.url);
        currentAudio.autoplay = false;

        document.getElementById("play-button").setAttribute("data-estado", "play");
        mostrarPantalla("reproductor");

        // Mostrar loader y ocultar botones/texto al principio
        document.getElementById("loader").style.display = "block";
        document.getElementById("play-button").style.display = "none";
        document.getElementById("repro-status").innerText = "Cargando canción...";

        // Esperar a que esté cargado el audio
        currentAudio.addEventListener("canplaythrough", () => {
          // Ocultar loader y mostrar botón
          document.getElementById("loader").style.display = "none";
          document.getElementById("play-button").style.display = "inline-block";
          document.getElementById("repro-status").innerText = "Canción lista para reproducir";
        });

        document.getElementById("play-button").onclick = () => {
          const btn = document.getElementById("play-button");
          const status = document.getElementById("repro-status");

          if (currentAudio.paused) {
            currentAudio.play();
            btn.classList.remove("estado-play", "estado-pause");
            btn.classList.add("estado-pause");
            btn.setAttribute("data-estado", "pause");
            status.innerText = "Reproduciendo canción...";
          } else {
            currentAudio.pause();
            btn.classList.remove("estado-pause");
            btn.classList.add("estado-play", "estado-pause");
            btn.setAttribute("data-estado", "play");
            status.innerText = "Canción en pausa";
          }
        };
      } else {
        alert("No se encontró esa canción.");
        volverAlMenu();
      }
    },
    error => {
      console.warn(`QR no detectado: ${error}`);
    }
  );
}

function volverAlMenu() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    document.getElementById("play-button").setAttribute("data-estado", "play");
    document.getElementById("repro-status").innerText = "Canción lista para reproducir";
  }
  mostrarPantalla("menu");
}
