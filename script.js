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

function debugLog(msg) {
  const consoleDiv = document.getElementById("debug-console");
  const time = new Date().toLocaleTimeString();
  consoleDiv.innerHTML += `<div>[${time}] ${msg}</div>`;
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function iniciarEscaner() {
  const qrResult = document.getElementById("qr-result");
  const playButton = document.getElementById("play-button");

  qrResult.innerText = "";
  playButton.style.display = "none"; // ocultar botón al iniciar

  const html5QrCode = new Html5Qrcode("qr-reader");

  html5QrCode.start(
    { facingMode: { exact: "environment" } },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      await html5QrCode.stop();
      qrResult.innerHTML = 'Canción lista para reproducir. <button id="play-btn">Reproducir</button>';

      /*    const playBtn = document.getElementById('play-btn');
            playBtn.addEventListener('click', async () => { */
      try {
        const docRef = db.collection("canciones").doc(decodedText);
        const docSnap = await docRef.get();
        //debugLog("Buscando documento con ID: " + decodedText);


        if (docSnap.exists) {
          const data = docSnap.data();
          //debugLog("Documento encontrado: " + JSON.stringify(data));

          // Guardamos el audio para reproducir cuando se presione el botón
          currentAudio = new Audio(data.url);
          currentAudio.autoplay = false;

          playButton.style.display = "inline-block"; // mostrar botón

          // Configurar evento para reproducir la canción al presionar el botón
          playButton.onclick = () => {
            currentAudio.play();
            qrResult.innerText = "Reproduciendo canción...";
          };
        } else {
          qrResult.innerText = "No se encontró esa canción.";
          //debugLog("Documento no encontrado en Firestore.");
          playButton.style.display = "none";
        }
      } catch (e) {
        qrResult.innerText = "Error al buscar la canción.";
        console.error(e);
        //debugLog("Error al acceder a Firestore: " + e.message);
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


