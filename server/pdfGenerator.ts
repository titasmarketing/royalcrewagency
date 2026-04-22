import PDFDocument from "pdfkit";
import { LOGO_BASE64 } from "./logoBase64";

interface ContractData {
  eventTitle: string;
  eventDate: string;
  clientName: string;
  clientDocument: string;
  location: string;
  totalPrice: string;
  services: string[];
}

interface ServiceOrderData {
  eventTitle: string;
  eventDate: string;
  location: string;
  staffMembers: Array<{
    name: string;
    role: string;
    startTime: string;
    endTime: string;
  }>;
  inventoryItems: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
}

/** Draw the standard header with logo + company name */
function drawHeader(doc: InstanceType<typeof PDFDocument>) {
  const logoBuffer = Buffer.from(LOGO_BASE64, "base64");
  const pageWidth = doc.page.width;
  const logoSize = 60;
  const logoX = (pageWidth - logoSize) / 2;
  doc.image(logoBuffer, logoX, 40, { width: logoSize, height: logoSize });

  doc
    .moveDown(0)
    .fontSize(18)
    .fillColor("#0c1b33")
    .text("ROYAL CREW AGENCY", 0, 110, { align: "center" })
    .fontSize(9)
    .fillColor("#888888")
    .text("Premium Event Staffing & Management", { align: "center" })
    .moveDown(1.5);

  const margin = 50;
  const y = doc.y;
  doc
    .moveTo(margin, y)
    .lineTo(pageWidth - margin, y)
    .strokeColor("#D4AF37")
    .lineWidth(1.5)
    .stroke()
    .moveDown(1);
}

/** Draw footer with generation date */
function drawFooter(doc: InstanceType<typeof PDFDocument>) {
  const pageWidth = doc.page.width;
  const footerY = doc.page.height - 45;
  const margin = 50;

  doc
    .moveTo(margin, footerY - 10)
    .lineTo(pageWidth - margin, footerY - 10)
    .strokeColor("#D4AF37")
    .lineWidth(0.5)
    .stroke();

  doc
    .fontSize(7.5)
    .fillColor("#999999")
    .text(
      `Generated on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} at ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}   ·   Royal Crew Agency   ·   www.royalcrewagency.com`,
      margin,
      footerY,
      { align: "center", width: pageWidth - margin * 2 }
    );
}

/**
 * Generate a Service Contract PDF (fully in English)
 */
export async function generateContract(data: ContractData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc);

    doc
      .fontSize(15)
      .fillColor("#D4AF37")
      .text("SERVICE AGREEMENT", { align: "center" })
      .moveDown(1.5);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("EVENT DETAILS", { underline: true })
      .moveDown(0.4);

    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(`Event: ${data.eventTitle}`)
      .text(`Date: ${data.eventDate}`)
      .text(`Venue: ${data.location || "To be confirmed"}`)
      .moveDown(1);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("CLIENT DETAILS", { underline: true })
      .moveDown(0.4);

    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(`Full Name / Company: ${data.clientName}`)
      .text(`Reference / ID: ${data.clientDocument}`)
      .moveDown(1);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("SERVICES CONTRACTED", { underline: true })
      .moveDown(0.4);

    data.services.forEach((service, index) => {
      doc.fontSize(10).fillColor("#333333").text(`${index + 1}. ${service}`);
    });
    doc.moveDown(1);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("TOTAL VALUE", { underline: true })
      .moveDown(0.4);

    doc
      .fontSize(16)
      .fillColor("#D4AF37")
      .text(`£ ${data.totalPrice}`)
      .moveDown(1.5);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("TERMS & CONDITIONS", { underline: true })
      .moveDown(0.4);

    const clauses = [
      "1. SCOPE: This agreement covers the provision of event staffing and management services as specified above.",
      "2. PAYMENT: Payment shall be made in accordance with the conditions agreed between both parties.",
      "3. RESPONSIBILITIES: Royal Crew Agency undertakes to deliver all services with the highest standards of quality and professionalism.",
      "4. CANCELLATION: In the event of cancellation, the applicable cancellation policy in force at the time shall apply.",
      "5. JURISDICTION: Any disputes arising from this agreement shall be subject to the jurisdiction of the courts of England and Wales.",
    ];

    clauses.forEach((clause) => {
      doc.fontSize(9).fillColor("#444444").text(clause, { align: "justify" }).moveDown(0.5);
    });

    doc.moveDown(2);

    const sigY = doc.y;
    const pageWidth = doc.page.width;
    const margin = 50;
    const colW = (pageWidth - margin * 2 - 40) / 2;

    doc.moveTo(margin, sigY).lineTo(margin + colW, sigY).strokeColor("#333333").lineWidth(0.8).stroke();
    doc.moveTo(margin + colW + 40, sigY).lineTo(pageWidth - margin, sigY).strokeColor("#333333").lineWidth(0.8).stroke();
    doc.fontSize(9).fillColor("#333333")
      .text("CLIENT", margin, sigY + 5, { width: colW })
      .text("ROYAL CREW AGENCY", margin + colW + 40, sigY + 5, { width: colW });

    drawFooter(doc);
    doc.end();
  });
}

/**
 * Generate a Service Order PDF (fully in English)
 */
export async function generateServiceOrder(data: ServiceOrderData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc);

    doc
      .fontSize(15)
      .fillColor("#D4AF37")
      .text("SERVICE ORDER", { align: "center" })
      .moveDown(1.5);

    doc
      .fontSize(11)
      .fillColor("#0c1b33")
      .text("EVENT INFORMATION", { underline: true })
      .moveDown(0.4);

    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(`Event: ${data.eventTitle}`)
      .text(`Date: ${data.eventDate}`)
      .text(`Venue: ${data.location || "To be confirmed"}`)
      .moveDown(1);

    if (data.staffMembers.length > 0) {
      doc.fontSize(11).fillColor("#0c1b33").text("ASSIGNED TEAM", { underline: true }).moveDown(0.4);
      data.staffMembers.forEach((member, index) => {
        doc.fontSize(10).fillColor("#333333")
          .text(`${index + 1}. ${member.name} — ${member.role} (${member.startTime} to ${member.endTime})`);
      });
      doc.moveDown(1);
    }

    if (data.inventoryItems.length > 0) {
      doc.fontSize(11).fillColor("#0c1b33").text("REQUIRED MATERIALS", { underline: true }).moveDown(0.4);
      data.inventoryItems.forEach((item, index) => {
        doc.fontSize(10).fillColor("#333333").text(`${index + 1}. ${item.name} — ${item.quantity} ${item.unit}`);
      });
      doc.moveDown(1);
    }

    doc.fontSize(11).fillColor("#0c1b33").text("GENERAL INSTRUCTIONS", { underline: true }).moveDown(0.4);

    const instructions = [
      "• All team members must arrive at least 30 minutes before the event start time.",
      "• Uniforms must be immaculate and comply with Royal Crew Agency standards.",
      "• Verify all materials and equipment before the event begins.",
      "• Maintain constant communication with the event coordinator.",
      "• Report any unexpected issues immediately to the supervisor.",
    ];

    instructions.forEach((instruction) => {
      doc.fontSize(9).fillColor("#444444").text(instruction).moveDown(0.3);
    });

    drawFooter(doc);
    doc.end();
  });
}

/**
 * Generate an Invoice PDF (fully in English)
 */
export async function generateInvoice(data: {
  invoiceNumber: string;
  eventTitle: string;
  clientName: string;
  clientDocument: string;
  services: Array<{ description: string; quantity: number; unitPrice: string; total: string }>;
  subtotal: string;
  taxes: string;
  total: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc);

    doc
      .fontSize(15)
      .fillColor("#D4AF37")
      .text("INVOICE", { align: "center" })
      .fontSize(11)
      .fillColor("#555555")
      .text(`No. ${data.invoiceNumber}`, { align: "center" })
      .moveDown(1.5);

    doc.fontSize(11).fillColor("#0c1b33").text("CLIENT DETAILS", { underline: true }).moveDown(0.4);

    doc
      .fontSize(10)
      .fillColor("#333333")
      .text(`Full Name / Company: ${data.clientName}`)
      .text(`Reference / ID: ${data.clientDocument}`)
      .text(`Event: ${data.eventTitle}`)
      .moveDown(1);

    doc.fontSize(11).fillColor("#0c1b33").text("SERVICES RENDERED", { underline: true }).moveDown(0.5);

    const tableTop = doc.y;
    const pageWidth = doc.page.width;
    const margin = 50;

    doc
      .fontSize(9)
      .fillColor("#0c1b33")
      .text("Description", margin, tableTop, { width: 210 })
      .text("Qty", 270, tableTop, { width: 40 })
      .text("Unit Price", 320, tableTop, { width: 90 })
      .text("Total", 420, tableTop, { width: 100 });

    doc.moveTo(margin, tableTop + 15).lineTo(pageWidth - margin, tableTop + 15)
      .strokeColor("#D4AF37").lineWidth(1).stroke();

    let currentY = tableTop + 25;

    data.services.forEach((service) => {
      doc
        .fontSize(9)
        .fillColor("#333333")
        .text(service.description, margin, currentY, { width: 210 })
        .text(service.quantity.toString(), 270, currentY, { width: 40 })
        .text(`£ ${service.unitPrice}`, 320, currentY, { width: 90 })
        .text(`£ ${service.total}`, 420, currentY, { width: 100 });
      currentY += 20;
    });

    doc.moveTo(margin, currentY).lineTo(pageWidth - margin, currentY)
      .strokeColor("#cccccc").lineWidth(0.5).stroke();
    currentY += 15;

    doc.fontSize(10).fillColor("#333333")
      .text("Subtotal:", 340, currentY)
      .text(`£ ${data.subtotal}`, 450, currentY);
    currentY += 18;

    doc.text("VAT / Taxes:", 340, currentY).text(`£ ${data.taxes}`, 450, currentY);
    currentY += 18;

    doc.rect(330, currentY - 4, pageWidth - margin - 330, 24).fillColor("#0c1b33").fill();
    doc.fontSize(12).fillColor("#D4AF37")
      .text("TOTAL:", 340, currentY)
      .text(`£ ${data.total}`, 450, currentY);

    drawFooter(doc);
    doc.end();
  });
}
