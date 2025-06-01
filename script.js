import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
      { facingMode: { exact: "environment" } }, // fuerza la cámara trasera
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText) => {
        html5QrCode.stop().then(() => {
          if (/^https?:\/\//i.test(decodedText)) {
            qrResult.innerText = "Cargando...";
            setTimeout(() => {
              window.location.href = decodedText;
            }, 800); // 800ms para que se vea el mensaje
          } else {
            qrResult.innerText = `Código escaneado: ${decodedText}`;
          }
        });
      },
      (error) => {
        console.warn(`No se detectó un QR: ${error}`);
      }
    ).catch(err => {
      qrResult.innerText = `No se pudo iniciar la cámara: ${err}`;
    });
  }
  
