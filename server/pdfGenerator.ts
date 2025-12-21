import PDFDocument from "pdfkit";
import { Readable } from "stream";

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

/**
 * Gera um contrato de prestação de serviços em PDF
 */
export async function generateContract(data: ContractData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header com logo e título
    doc
      .fontSize(20)
      .fillColor("#001F3F")
      .text("ROYAL CREW AGENCY", { align: "center" })
      .fontSize(10)
      .fillColor("#666666")
      .text("Plataforma Premium de Gestão de Eventos", { align: "center" })
      .moveDown(2);

    // Título do documento
    doc
      .fontSize(16)
      .fillColor("#D4AF37")
      .text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", { align: "center" })
      .moveDown(2);

    // Informações do evento
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("DADOS DO EVENTO", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Evento: ${data.eventTitle}`, { continued: false })
      .text(`Data: ${data.eventDate}`)
      .text(`Local: ${data.location}`)
      .moveDown(1);

    // Informações do contratante
    doc
      .fontSize(12)
      .text("CONTRATANTE", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Nome/Razão Social: ${data.clientName}`)
      .text(`CPF/CNPJ: ${data.clientDocument}`)
      .moveDown(1);

    // Serviços contratados
    doc
      .fontSize(12)
      .text("SERVIÇOS CONTRATADOS", { underline: true })
      .moveDown(0.5);

    data.services.forEach((service, index) => {
      doc.fontSize(10).text(`${index + 1}. ${service}`);
    });
    doc.moveDown(1);

    // Valor total
    doc
      .fontSize(12)
      .text("VALOR TOTAL", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor("#D4AF37")
      .text(`R$ ${data.totalPrice}`, { align: "left" })
      .moveDown(2);

    // Cláusulas contratuais
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("CLÁUSULAS CONTRATUAIS", { underline: true })
      .moveDown(0.5);

    const clauses = [
      "1. DO OBJETO: O presente contrato tem por objeto a prestação de serviços de organização e execução de eventos conforme especificado acima.",
      "2. DO PAGAMENTO: O pagamento será realizado conforme condições acordadas entre as partes.",
      "3. DAS RESPONSABILIDADES: A CONTRATADA se responsabiliza pela execução dos serviços com qualidade e profissionalismo.",
      "4. DO CANCELAMENTO: Em caso de cancelamento, aplicam-se as políticas de cancelamento vigentes.",
      "5. DO FORO: Fica eleito o foro da comarca da prestação dos serviços para dirimir quaisquer dúvidas oriundas do presente contrato.",
    ];

    clauses.forEach((clause) => {
      doc.fontSize(9).text(clause, { align: "justify" }).moveDown(0.5);
    });

    doc.moveDown(2);

    // Assinaturas
    const signatureY = doc.y + 50;
    doc
      .fontSize(10)
      .text("_".repeat(40), 50, signatureY)
      .text("CONTRATANTE", 50, signatureY + 20, { align: "left" });

    doc
      .text("_".repeat(40), 320, signatureY)
      .text("ROYAL CREW AGENCY", 320, signatureY + 20, { align: "left" });

    // Footer
    doc
      .fontSize(8)
      .fillColor("#666666")
      .text(
        `Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );

    doc.end();
  });
}

/**
 * Gera uma ordem de serviço em PDF
 */
export async function generateServiceOrder(data: ServiceOrderData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc
      .fontSize(20)
      .fillColor("#001F3F")
      .text("ROYAL CREW AGENCY", { align: "center" })
      .fontSize(10)
      .fillColor("#666666")
      .text("Plataforma Premium de Gestão de Eventos", { align: "center" })
      .moveDown(2);

    // Título
    doc
      .fontSize(16)
      .fillColor("#D4AF37")
      .text("ORDEM DE SERVIÇO", { align: "center" })
      .moveDown(2);

    // Informações do evento
    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("DADOS DO EVENTO", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Evento: ${data.eventTitle}`)
      .text(`Data: ${data.eventDate}`)
      .text(`Local: ${data.location}`)
      .moveDown(1);

    // Equipe escalada
    if (data.staffMembers.length > 0) {
      doc
        .fontSize(12)
        .text("EQUIPE ESCALADA", { underline: true })
        .moveDown(0.5);

      data.staffMembers.forEach((member, index) => {
        doc
          .fontSize(10)
          .text(
            `${index + 1}. ${member.name} - ${member.role} (${member.startTime} às ${member.endTime})`
          );
      });
      doc.moveDown(1);
    }

    // Materiais necessários
    if (data.inventoryItems.length > 0) {
      doc
        .fontSize(12)
        .text("MATERIAIS NECESSÁRIOS", { underline: true })
        .moveDown(0.5);

      data.inventoryItems.forEach((item, index) => {
        doc.fontSize(10).text(`${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`);
      });
      doc.moveDown(1);
    }

    // Instruções
    doc
      .fontSize(12)
      .text("INSTRUÇÕES GERAIS", { underline: true })
      .moveDown(0.5);

    const instructions = [
      "• Todos os membros da equipe devem chegar com 30 minutos de antecedência",
      "• Uniformes devem estar impecáveis e de acordo com o padrão Royal Crew",
      "• Verificar todos os materiais antes do início do evento",
      "• Manter comunicação constante com o coordenador do evento",
      "• Reportar qualquer imprevisto imediatamente",
    ];

    instructions.forEach((instruction) => {
      doc.fontSize(9).text(instruction).moveDown(0.3);
    });

    // Footer
    doc
      .fontSize(8)
      .fillColor("#666666")
      .text(
        `Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );

    doc.end();
  });
}

/**
 * Gera uma nota fiscal simplificada em PDF
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

    // Header
    doc
      .fontSize(20)
      .fillColor("#001F3F")
      .text("ROYAL CREW AGENCY", { align: "center" })
      .fontSize(10)
      .fillColor("#666666")
      .text("Plataforma Premium de Gestão de Eventos", { align: "center" })
      .moveDown(2);

    // Título e número
    doc
      .fontSize(16)
      .fillColor("#D4AF37")
      .text("NOTA FISCAL DE SERVIÇO", { align: "center" })
      .fontSize(12)
      .fillColor("#000000")
      .text(`Nº ${data.invoiceNumber}`, { align: "center" })
      .moveDown(2);

    // Dados do cliente
    doc
      .fontSize(12)
      .text("DADOS DO CLIENTE", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Nome/Razão Social: ${data.clientName}`)
      .text(`CPF/CNPJ: ${data.clientDocument}`)
      .text(`Referente ao evento: ${data.eventTitle}`)
      .moveDown(1);

    // Tabela de serviços
    doc
      .fontSize(12)
      .text("DISCRIMINAÇÃO DOS SERVIÇOS", { underline: true })
      .moveDown(0.5);

    // Cabeçalho da tabela
    const tableTop = doc.y;
    doc
      .fontSize(9)
      .text("Descrição", 50, tableTop, { width: 200 })
      .text("Qtd", 260, tableTop, { width: 40 })
      .text("Valor Unit.", 310, tableTop, { width: 80 })
      .text("Total", 400, tableTop, { width: 100 });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let currentY = tableTop + 25;

    // Linhas da tabela
    data.services.forEach((service) => {
      doc
        .fontSize(9)
        .text(service.description, 50, currentY, { width: 200 })
        .text(service.quantity.toString(), 260, currentY, { width: 40 })
        .text(`R$ ${service.unitPrice}`, 310, currentY, { width: 80 })
        .text(`R$ ${service.total}`, 400, currentY, { width: 100 });

      currentY += 20;
    });

    doc
      .moveTo(50, currentY)
      .lineTo(550, currentY)
      .stroke();

    currentY += 20;

    // Totais
    doc
      .fontSize(10)
      .text("Subtotal:", 350, currentY)
      .text(`R$ ${data.subtotal}`, 450, currentY);

    currentY += 20;

    doc.text("Impostos:", 350, currentY).text(`R$ ${data.taxes}`, 450, currentY);

    currentY += 20;

    doc
      .fontSize(12)
      .fillColor("#D4AF37")
      .text("TOTAL:", 350, currentY)
      .text(`R$ ${data.total}`, 450, currentY);

    // Footer
    doc
      .fontSize(8)
      .fillColor("#666666")
      .text(
        `Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );

    doc.end();
  });
}
