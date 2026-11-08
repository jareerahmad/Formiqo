
import jsPDF from "jspdf";

export const generateFormalEmailPdf = (email) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;

    let y = 25;

    const addText = (text, fontSize = 11, bold = false, spacing = 6) => {
        if (!text) return;

        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(45, 45, 45);

        const lines = pdf.splitTextToSize(String(text), contentWidth);

        // Start a new page if the content would exceed the page.
        const requiredHeight = lines.length * spacing + 8;

        if (y + requiredHeight > pageHeight - 25) {
            pdf.addPage();
            y = 25;
        }

        pdf.text(lines, margin, y);
        y += requiredHeight;
    };

    // Top accent
    pdf.setFillColor(16, 120, 85);
    pdf.rect(0, 0, pageWidth, 8, "F");

    // Document heading
    addText(email.title || "Formal Email", 19, true, 9);

    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Email details
    addText(`Date: ${email.date || "-"}`, 10, false, 5);
    addText(`From: ${email.senderName || "-"}`, 10, false, 5);
    addText(`To: ${email.recipientName || "-"}`, 10, false, 5);

    if (email.senderEmail) {
        addText(`Sender Email: ${email.senderEmail}`, 10, false, 5);
    }

    if (email.recipientEmail) {
        addText(`Recipient Email: ${email.recipientEmail}`, 10, false, 5);
    }

    if (email.cc) addText(`CC: ${email.cc}`, 10, false, 5);
    if (email.department) addText(`Department: ${email.department}`, 10, false, 5);

    y += 5;

    addText(`Subject: ${email.subject || "No subject"}`, 12, true, 7);

    addText(`Dear ${email.salutation || "Recipient"},`, 11, false, 6);

    addText(email.greeting || "", 11, false, 6);
    addText(email.body || "", 11, false, 6);
    addText(email.additionalMessage || "", 11, false, 6);
    addText(email.closing || "Best regards,", 11, false, 6);

    y += 3;

    addText(email.senderName || "", 11, true, 6);

    if (email.jobTitle) addText(email.jobTitle, 10, false, 5);
    if (email.companyName) addText(email.companyName, 10, false, 5);
    if (email.senderPhone) addText(email.senderPhone, 10, false, 5);

    // Footer on every page
    const totalPages = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
            `Generated with Formiqo | Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 12,
            { align: "center" }
        );
    }

    const fileName = (email.subject || "formal-email")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    pdf.save(`${fileName || "formal-email"}.pdf`);
};
