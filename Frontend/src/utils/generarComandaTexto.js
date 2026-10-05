export function generarComandaTexto(comanda) {
  // 🔍 PARCHE DE EXTRACCIÓN SEGURO: 
  // Si 'usuario' es un objeto (de tu AuthContext), extraemos su propiedad '.nombre'. 
  // Si ya es un string directo, lo usamos tal cual.
  const nombreMesero = typeof comanda.usuario === 'object' && comanda.usuario !== null
    ? (comanda.usuario.nombre || comanda.usuario.name || "Sin mesero")
    : (comanda.usuario || "Sin mesero");

  const {
    razonSocialEmpresa = "Restaurante sin nombre",
    nitEmpresa = "NIT desconocido",
    mesa = "Sin mesa",
    platillos = [],
    propina = 0, // Recibe el número entero (ej: 0, 10)
  } = comanda;

  const now = new Date();

  // Formatear fecha y hora
  const fecha = now.toLocaleDateString("es-CO");
  const hora = now.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const [dia, mes, anio] = fecha.split("/");
  const hora24 = now.getHours();
  const minutos = now.getMinutes().toString().padStart(2, "0");
  const ampm = hora24 >= 12 ? "pm" : "am";
  const hora12 = ((hora24 + 11) % 12) + 1;
  const horaNombre = `${hora12}-${minutos}${ampm}`;
  const nombreArchivo = `${mesa} ${dia}-${mes}-${anio} ${horaNombre}.txt`;

  // Confirmación de descarga
  const aceptar = window.confirm(
    `Se generará y descargará el archivo "${nombreArchivo}".\n\nPresiona Aceptar para continuar.`
  );
  if (!aceptar) return;

  // LÓGICA DE CÁLCULOS CORRECTOS (Base INC 8% e Integridad Numérica)
  let totalMenuConImpuesto = 0;
  let textoPlatillos = "";

  platillos.forEach((p, i) => {
    const precioPlato = p.precio || 0;
    totalMenuConImpuesto += precioPlato;
    textoPlatillos += `${i + 1}. ${p.nombre} $${precioPlato.toLocaleString("es-CO")}\n`;
  });

  // El precio de la carta ya tiene el impuesto incluido. Hallamos la base (Subtotal)
  const subtotalOINC = Math.round(totalMenuConImpuesto / 1.08);
  const impuestoConsumo = totalMenuConImpuesto - subtotalOINC; // Evita desfases por redondeo
  
  const totalSinPropina = totalMenuConImpuesto;
  const valorPropina = Math.round(totalSinPropina * (propina / 100));
  const totalAPagar = totalSinPropina + valorPropina;

  // CONSTRUCCIÓN DEL TEXTO (Formato P.O.S. Legal)
  let texto = "";
  texto += "==================================================\n";
  texto += "                 SISTEMA P.O.S. \n";
  texto += `                ${razonSocialEmpresa.toUpperCase()}\n`;
  texto += `               NIT: ${nitEmpresa}\n`;
  texto += "==================================================\n";
  texto += `Mesa: ${mesa}               Fecha: ${fecha}\n`;
  texto += `Mesero: ${nombreMesero}     Hora: ${hora}\n`; // 👈 Cambiado 'usuario' por 'nombreMesero'
  texto += "--------------------------------------------------\n";
  texto += textoPlatillos;
  texto += "--------------------------------------------------\n";
  texto += `SUBTOTAL GRAVADO (INC 8%):       $${subtotalOINC.toLocaleString("es-CO")}\n`;
  texto += `IMPUESTO AL CONSUMO (8%):        $${impuestoConsumo.toLocaleString("es-CO")}\n`;
  texto += `TOTAL SIN PROPINA:               $${totalSinPropina.toLocaleString("es-CO")}\n\n`;
  texto += `PROPINA VOLUNTARIA (${propina}%):         + $${valorPropina.toLocaleString("es-CO")}\n`;
  texto += "--------------------------------------------------\n";
  texto += `TOTAL A PAGAR:                   $${totalAPagar.toLocaleString("es-CO")}\n`;
  texto += "==================================================\n\n";

  // Textos de cumplimiento legal obligatorio
  texto += "[ADVERTENCIA LEGAL DE PROPINAS - LEY 1935 DE 2018]\n";
  texto += "En este establecimiento el pago de la propina es\n";
  texto += "TOTALMENTE VOLUNTARIO. El consumidor puede aceptar,\n";
  texto += "rechazar o modificar su valor en cualquier momento.\n";
  texto += "Ante irregularidades, denuncie ante la SIC.\n\n";

  texto += "[HABEAS DATA - LEY 1581 DE 2012]\n";
  texto += "Los datos personales registrados serán tratados\n";
  texto += "conforme a nuestra Política de Tratamiento de\n";
  texto += "Datos Personales para fines de facturación.\n\n";

  texto += "[INTEGRIDAD DIGITAL - LEY 527 DE 1999]\n";
  texto += `Documento emitido de manera electrónica. \n`;
  texto += `ID Único de Transacción: TX-${Math.floor(100000 + Math.random() * 900000)}\n`;
  texto += "==================================================\n";
  texto += "    ¡Gracias por su compra! Visítenos de nuevo.\n";
  texto += "==================================================\n";

  // Crear Blob y descargar
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
