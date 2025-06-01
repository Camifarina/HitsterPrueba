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
    qrResult.innerText = "";
    const html5QrCode = new Html5Qrcode("qr-reader");
  
    Html5Qrcode.getCameras().then(devices => {
      if (devices.length === 0) {
        qrResult.innerText = "No se encontraron cámaras";
        return;
      }
  
      // Intenta encontrar una cámara trasera
      let backCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
  
      const cameraId = backCamera ? backCamera.id : devices[0].id;
  
      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {
          qrResult.innerText = `Resultado: ${decodedText}`;
          html5QrCode.stop();
        },
        (error) => {
          console.warn(`No se detectó un QR: ${error}`);
        }
      ).catch(err => {
        qrResult.innerText = `No se pudo iniciar la cámara: ${err}`;
      });
    });
  }
  
  