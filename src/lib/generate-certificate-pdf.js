
import jsPDF from "jspdf";

export const generateCertificatePdf = (certificate) => {
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(250, 252, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Outer border
    pdf.setDrawColor(16, 120, 85);
    pdf.setLineWidth(2);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Inner border
    pdf.setDrawColor(190, 220, 205);
    pdf.setLineWidth(0.5);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Decorative accent
    pdf.setFillColor(16, 120, 85);
    pdf.rect(8, 8, pageWidth - 16, 5, "F");

    // Organization
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.setTextColor(16, 100, 70);
    pdf.text(
        certificate.organizationName || "Your Organization",
        pageWidth / 2,
        35,
        { align: "center" }
    );

    if (certificate.organizationSubtitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(100, 110, 105);
        pdf.text(
            certificate.organizationSubtitle,
            pageWidth / 2,
            42,
            { align: "center" }
        );
    }

    // Certificate heading
    pdf.setFont("times", "bold");
    pdf.setFontSize(34);
    pdf.setTextColor(35, 45, 40);
    pdf.text(
        certificate.certificateTitle || "CERTIFICATE",
        pageWidth / 2,
        65,
        { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
    pdf.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", pageWidth / 2, 78, {
        align: "center",
    });

    // Recipient name
    pdf.setFont("times", "bold");
    pdf.setFontSize(29);
    pdf.setTextColor(16, 110, 75);
    pdf.text(
        certificate.recipientName || "Recipient Name",
        pageWidth / 2,
        98,
        { align: "center" }
    );

    // Name underline
    pdf.setDrawColor(16, 120, 85);
    pdf.setLineWidth(0.7);
    pdf.line(pageWidth / 2 - 65, 103, pageWidth / 2 + 65, 103);

    // Certificate description
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(65, 65, 65);

    const description = certificate.description ||
        "In recognition of successful completion and dedication.";

    const descriptionLines = pdf.splitTextToSize(description, 210);

    pdf.text(descriptionLines, pageWidth / 2, 117, {
        align: "center",
    });

    let y = 117 + descriptionLines.length * 6 + 9;

    // Course / program
    if (certificate.programName) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(35, 45, 40);
        pdf.text(certificate.programName, pageWidth / 2, y, {
            align: "center",
        });
        y += 12;
    }

    // Date and certificate ID
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(90, 90, 90);

    const leftX = 48;
    const rightX = pageWidth - 48;
    const detailsY = pageHeight - 48;

    pdf.text(`Date: ${certificate.issueDate || "-"}`, leftX, detailsY);

    pdf.text(
        `Certificate ID: ${certificate.certificateNumber || "-"}`,
        rightX,
        detailsY,
        { align: "right" }
    );

    // Signature areas
    const signatureY = pageHeight - 32;

    pdf.setDrawColor(100, 120, 110);
    pdf.line(48, signatureY, 105, signatureY);
    pdf.line(pageWidth - 105, signatureY, pageWidth - 48, signatureY);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(40, 50, 45);

    pdf.text(
        certificate.issuerName || "Authorized Signatory",
        76.5,
        signatureY + 6,
        { align: "center" }
    );

    pdf.text(
        certificate.secondSignatoryName || "Organization Representative",
        pageWidth - 76.5,
        signatureY + 6,
        { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(110, 110, 110);

    pdf.text(
        certificate.issuerTitle || "Authorized Signatory",
        76.5,
        signatureY + 11,
        { align: "center" }
    );

    pdf.text(
        certificate.secondSignatoryTitle || "Representative",
        pageWidth - 76.5,
        signatureY + 11,
        { align: "center" }
    );

    // Footer
    if (certificate.footerText) {
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(certificate.footerText, pageWidth / 2, pageHeight - 13, {
            align: "center",
        });
    }

    const fileName = (certificate.recipientName || "certificate")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    pdf.save(`${fileName || "certificate"}-certificate.pdf`);
};
