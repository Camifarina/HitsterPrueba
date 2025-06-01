function mostrarReglas() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("reglas").style.display = "block";
  }
  
  function mostrarEscaner() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("escaner").style.display = "block";
  
    iniciarEscaner();
  }
  
  function volverAlMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("reglas").style.display = "none";
    document.getElementById("escaner").style.display = "none";
  }
  
  function iniciarEscaner() {
    const qrResult = document.getElementById("qr-result");
    const qrReader = document.getElementById("qr-reader");
    qrResult.innerText = "";
  
    const html5QrCode = new Html5Qrcode("qr-reader");
  
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250
          },
          (decodedText) => {
            qrResult.innerText = `Resultado: ${decodedText}`;
            html5QrCode.stop();
          }
        );
      }
    }).catch(err => {
      qrResult.innerText = `No se pudo acceder a la cámara: ${err}`;
    });
  }
  