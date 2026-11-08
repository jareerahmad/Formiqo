export async function generateCoverLetterPdf(letter) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 22;
    const contentWidth = pageWidth - margin * 2;

    const green = [16, 185, 129];
    const dark = [31, 41, 55];
    const muted = [107, 114, 128];

    let y = 25;

    const addText = (text, x, currentY, maxWidth, fontSize = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text || "", maxWidth);
        pdf.text(lines, x, currentY);
        return lines.length * (fontSize * 0.48);
    };

    const addSection = (text, spacing = 8) => {
        y += spacing;

        if (y > pageHeight - 25) {
            pdf.addPage();
            y = 25;
        }

        pdf.setTextColor(...dark);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(text, margin, y);

        y += 7;
    };

    // Header accent
    pdf.setFillColor(...green);
    pdf.rect(0, 0, pageWidth, 5, "F");

    // Applicant name
    pdf.setTextColor(...dark);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(21);
    pdf.text(letter.fullName || "Your Name", margin, y);

    y += 9;

    if (letter.jobTitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...muted);
        pdf.text(letter.jobTitle, margin, y);
        y += 7;
    }

    // Contact details
    const contactDetails = [
        letter.email,
        letter.phone,
        letter.location,
        letter.website,
    ].filter(Boolean);

    if (contactDetails.length) {
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);

        const contactText = contactDetails.join("  |  ");
        const contactLines = pdf.splitTextToSize(contactText, contentWidth);
        pdf.text(contactLines, margin, y);

        y += contactLines.length * 5 + 5;
    }

    // Divider
    pdf.setDrawColor(220, 226, 232);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;

    // Date
    if (letter.date) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);
        pdf.text(letter.date, margin, y);
        y += 10;
    }

    // Recipient
    if (letter.companyName || letter.recipientName || letter.companyAddress) {
        const recipientLines = [
            letter.recipientName,
            letter.recipientTitle,
            letter.companyName,
            letter.companyAddress,
        ].filter(Boolean);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);

        recipientLines.forEach((line) => {
            pdf.text(line, margin, y);
            y += 5;
        });

        y += 6;
    }

    // Subject
    if (letter.subject) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);

        const subjectLines = pdf.splitTextToSize(
            `Subject: ${letter.subject}`,
            contentWidth
        );

        pdf.text(subjectLines, margin, y);
        y += subjectLines.length * 5 + 7;
    }

    // Greeting
    if (letter.greeting) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);
        pdf.text(letter.greeting, margin, y);
        y += 10;
    }

    // Body
    if (letter.body) {
        const paragraphs = letter.body.split("\n").filter(Boolean);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);

        paragraphs.forEach((paragraph) => {
            const lines = pdf.splitTextToSize(paragraph, contentWidth);

            if (y + lines.length * 5 > pageHeight - 25) {
                pdf.addPage();
                y = 25;
            }

            pdf.text(lines, margin, y);
            y += lines.length * 5 + 5;
        });
    }

    // Closing
    y += 5;

    if (letter.closing) {
        if (y > pageHeight - 25) {
            pdf.addPage();
            y = 25;
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(letter.closing, margin, y);
        y += 12;
    }

    if (letter.signatureName) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(letter.signatureName, margin, y);
        y += 5;
    }

    if (letter.signatureTitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(letter.signatureTitle, margin, y);
    }

    // Filename
    const filename = (letter.fullName || "cover-letter")
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

    pdf.save(`${filename || "cover-letter"}-cover-letter.pdf`);
}