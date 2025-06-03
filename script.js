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

        mostrarPantalla("reproductor");

        document.getElementById("play-button").onclick = () => {
          currentAudio.play();
          document.getElementById("repro-status").innerText = "Reproduciendo canción...";
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
  }
  mostrarPantalla("menu");
}


/* 
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

/* function debugLog(msg) {
  const consoleDiv = document.getElementById("debug-console");
  const time = new Date().toLocaleTimeString();
  consoleDiv.innerHTML += `<div>[${time}] ${msg}</div>`;
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
} 

function iniciarEscaner() {
  const qrResult = document.getElementById("qr-result");
  const playButton = document.getElementById("play-toggle-button");

  qrResult.innerText = "";
  playButton.style.display = "none"; // Ocultar al iniciar

  const html5QrCode = new Html5Qrcode("qr-reader");

  html5QrCode.start(
    { facingMode: { exact: "environment" } },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      await html5QrCode.stop();
      qrResult.innerText = "Cargando canción...";

      try {
        const docRef = db.collection("canciones").doc(decodedText);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();

          // Detener canción anterior si hay
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          }

          currentAudio = new Audio(data.url);
          currentAudio.autoplay = false;

          playButton.innerText = "Reproducir";
          playButton.style.display = "inline-block";
          qrResult.innerText = "Canción lista.";

          playButton.onclick = () => {
            if (currentAudio.paused) {
              currentAudio.play();
              playButton.innerText = "Pausar";
              qrResult.innerText = "Reproduciendo canción...";
            } else {
              currentAudio.pause();
              playButton.innerText = "Reproducir";
              qrResult.innerText = "Canción pausada.";
            }
          };

          // Al terminar, reiniciar botón
          currentAudio.onended = () => {
            playButton.innerText = "Reproducir";
            qrResult.innerText = "Canción finalizada.";
          };

        } else {
          qrResult.innerText = "No se encontró esa canción.";
          playButton.style.display = "none";
        }
      } catch (e) {
        qrResult.innerText = "Error al buscar la canción.";
        console.error(e);
        playButton.style.display = "none";
      }
    },
    (error) => {
      console.warn(`No se detectó un QR: ${error}`);
    }
  ).catch(err => {
    qrResult.innerText = `No se pudo iniciar la cámara: ${err}`;
    playButton.style.display = "none";
  });
}

function volverAlMenu() {
  // Detener y reiniciar el audio si está reproduciéndose
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  document.getElementById("menu").style.display = "block";
  document.getElementById("reglas").style.display = "none";
  document.getElementById("escaner").style.display = "none";

  // Ocultar botón de reproducción y limpiar estado
  const playButton = document.getElementById("play-toggle-button");
  playButton.style.display = "none";
  playButton.innerText = "Reproducir";

  // Limpiar mensaje del resultado QR
  document.getElementById("qr-result").innerText = "";
}

 */