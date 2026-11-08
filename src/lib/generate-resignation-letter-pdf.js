
import jsPDF from "jspdf";

export const generateResignationLetterPdf = (letter) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;

    let y = 25;

    const addText = (text, fontSize = 11, bold = false, spacing = 7) => {
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(45, 45, 45);

        const lines = pdf.splitTextToSize(text || "", contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * spacing + 5;
    };

    // Top accent
    pdf.setFillColor(16, 120, 85);
    pdf.rect(0, 0, pageWidth, 8, "F");

    // Employee details
    addText(letter.employeeName || "Your Name", 17, true, 9);

    if (letter.employeeAddress) addText(letter.employeeAddress, 10, false, 5);
    if (letter.employeeEmail) addText(letter.employeeEmail, 10, false, 5);
    if (letter.employeePhone) addText(letter.employeePhone, 10, false, 5);

    y += 5;
    addText(letter.date || new Date().toLocaleDateString(), 10, false, 5);

    y += 5;

    // Recipient details
    if (letter.managerName) addText(`To: ${letter.managerName}`, 11, true);
    if (letter.companyName) addText(letter.companyName, 11, true);
    if (letter.companyAddress) addText(letter.companyAddress, 10, false, 5);

    y += 5;

    addText("Subject: Resignation from Position", 12, true);

    addText(
        `Dear ${letter.managerName || "Manager"},`,
        11,
        false
    );

    addText(
        letter.opening ||
        `Please accept this letter as formal notice of my resignation from my position as ${letter.jobTitle || "employee"} at ${letter.companyName || "the company"}.`,
        11,
        false
    );

    if (letter.lastWorkingDate) {
        addText(
            `My intended last working day will be ${letter.lastWorkingDate}.`,
            11,
            false
        );
    }

    if (letter.reason) {
        addText(letter.reason, 11, false);
    }

    if (letter.handover) {
        addText(letter.handover, 11, false);
    }

    if (letter.appreciation) {
        addText(letter.appreciation, 11, false);
    }

    if (letter.closing) {
        addText(letter.closing, 11, false);
    } else {
        addText(
            "Thank you for the opportunities and experience I have gained during my time with the organization. I wish the company continued success.",
            11,
            false
        );
    }

    addText("Sincerely,", 11, false);
    addText(letter.employeeName || "Your Name", 11, true);

    if (letter.jobTitle) {
        addText(letter.jobTitle, 10, false);
    }

    // Footer
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text(
        "Generated with Formiqo",
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
    );

    const fileName = (letter.employeeName || "resignation-letter")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    pdf.save(`${fileName || "resignation-letter"}-resignation.pdf`);
};
