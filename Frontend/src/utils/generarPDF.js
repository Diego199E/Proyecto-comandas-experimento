import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generarPDFComanda(comanda) {
  alert("⏳ Generando PDF, Dale aceptar para continuar.");

  const doc = new jsPDF();
  const margenIzq = 15;

  const razon = comanda.razonSocialEmpresa || "Restaurante sin nombre";
  const nit = comanda.nitEmpresa || "Sin NIT";
  const fechaHora = new Date(comanda.hora);
  const fecha = fechaHora.toLocaleDateString();
  const hora = fechaHora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  doc.setFontSize(16);
  doc.text("RECIBO DE PAGO", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(razon, 105, 28, { align: "center" });
  doc.text(`NIT: ${nit}`, 105, 34, { align: "center" });

  doc.setFontSize(11);
  doc.text(`Fecha: ${fecha}`, margenIzq, 45);
  doc.text(`Hora: ${hora}`, 140, 45);
  doc.text(`${comanda.mesa}`, margenIzq, 52);
  doc.text(`Mesero: ${comanda.usuario?.nombre || "Sin nombre"}`, 85, 52);

  doc.line(margenIzq, 58, 195, 58);

  let startY = 64;
  let totalIncluido = 0;

  comanda.platillos.forEach((plato, i) => {
    const precio = plato.precio || 0;
    totalIncluido += precio;
    const precioStr = `$${precio.toLocaleString("es-CO")}`;

    doc.setFont(undefined, "bold");
    doc.text(`${i + 1}. ${plato.nombre}`, margenIzq, startY);
    doc.text(precioStr, 190, startY, { align: "right" });
    startY += 6;

    startY += 3;
  });

  doc.line(margenIzq, startY, 195, startY);
  startY += 6;

  const usaIva = comanda.usaIva !== false;
  const subtotal = usaIva ? totalIncluido / 1.19 : totalIncluido;
  const iva = usaIva ? totalIncluido - subtotal : 0;

  // Manejo de propina
  const porcentajePropina = typeof comanda.propina === "number" ? comanda.propina : 0;
  const valorPropina = porcentajePropina > 0 ? totalIncluido * (porcentajePropina / 100) : 0;
  const totalFinal = totalIncluido + valorPropina;

  doc.setFont(undefined, "bold");
  doc.text("Subtotal:", 140, startY);
  doc.text(`$${subtotal.toFixed(0)}`, 195, startY, { align: "right" });
  startY += 6;

  if (usaIva) {
    doc.text("IVA (19%):", 140, startY);
    doc.text(`$${iva.toFixed(0)}`, 195, startY, { align: "right" });
    startY += 6;
  }

  doc.text("Total sin propina:", 140, startY);
  doc.text(`$${totalIncluido.toFixed(0)}`, 195, startY, { align: "right" });
  startY += 6;

  if (porcentajePropina > 0) {
    doc.text(`Propina (${porcentajePropina}%):`, 140, startY);
    doc.text(`+ $${valorPropina.toFixed(0)}`, 195, startY, { align: "right" });
    startY += 6;

    doc.text("TOTAL A PAGAR:", 140, startY);
    doc.text(`$${totalFinal.toFixed(0)}`, 195, startY, { align: "right" });
  } else {
    doc.text("TOTAL A PAGAR:", 140, startY);
    doc.text(`$${totalIncluido.toFixed(0)}`, 195, startY, { align: "right" });
  }

  doc.save(`Comanda_Mesa_${comanda.mesa}.pdf`);
}
