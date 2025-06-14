document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");

  // Obtener ubicación
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.getElementById("lat").value = pos.coords.latitude;
      document.getElementById("lng").value = pos.coords.longitude;
    }, () => {
      Swal.fire({
        icon: "warning",
        title: "Ubicación no disponible",
        text: "No se pudo obtener tu ubicación.",
      });
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Geolocalización no soportada",
      text: "Tu navegador no permite obtener la ubicación.",
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const file = form.foto.files[0];

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Archivo requerido",
        text: "Por favor selecciona una imagen.",
      });
      return;
    }

    Swal.fire({
      title: "Enviando reporte...",
      text: "Por favor espera mientras se envía tu información.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const reader = new FileReader();
    reader.onloadend = async () => {
      formData.set("foto", reader.result);

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzOd_elKuvqcBhYAxwc3-gAduLLpoGi4QeXHeHcXvw_LddJeNd0NCmqamw24CIk8g8L0w/exec", {
          method: "POST",
          body: formData,
        });

        const result = await response.text();

        if (response.ok && result.includes("success")) {
          Swal.fire({
            icon: "success",
            title: "¡Enviado!",
            text: "Tu reporte fue enviado con éxito.",
            confirmButtonColor: "#007BFF",
          });
          form.reset();
        } else {
          throw new Error(result);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error al enviar",
          text: "Hubo un problema al enviar el formulario.",
        });
      }
    };

    reader.readAsDataURL(file);
  });
});
