
export async function generateLetterPdf(letter) {
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();

    const left = 20;
    const right = 190;
    const contentWidth = right - left;
    let y = 22;

    function ensureSpace(height = 10) {
        if (y + height > 275) {
            pdf.addPage();
            y = 22;
        }
    }

    function addTextBlock(text, options = {}) {
        const {
            fontSize = 11,
            bold = false,
            color = [55, 65, 81],
            gapAfter = 7,
        } = options;

        if (!String(text || "").trim()) {
            y += gapAfter;
            return;
        }

        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);

        const lines = pdf.splitTextToSize(
            String(text).trim(),
            contentWidth
        );

        for (const line of lines) {
            ensureSpace(7);
            pdf.text(line, left, y);
            y += 6;
        }

        y += gapAfter;
    }

    // Formiqo letterhead
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(23);
    pdf.setTextColor(5, 150, 105);
    pdf.text("Formiqo", left, y);

    y += 7;

    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.7);
    pdf.line(left, y, right, y);

    y += 12;

    // Letter title
    addTextBlock(letter.title || "LETTER", {
        fontSize: 17,
        bold: true,
        color: [25, 25, 25],
        gapAfter: 10,
    });

    // Sender information
    addTextBlock(letter.senderName, {
        bold: true,
        color: [31, 41, 55],
        gapAfter: 2,
    });

    addTextBlock(letter.senderAddress, { gapAfter: 2 });
    addTextBlock(letter.senderEmail, { gapAfter: 2 });
    addTextBlock(letter.senderPhone, { gapAfter: 7 });

    // Date
    addTextBlock(
        letter.date
            ? new Date(`${letter.date}T12:00:00`).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
            )
            : "",
        { gapAfter: 9 }
    );

    // Recipient
    addTextBlock("To:", {
        bold: true,
        color: [5, 150, 105],
        gapAfter: 3,
    });

    addTextBlock(letter.recipientName, {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(letter.recipientAddress, { gapAfter: 9 });

    // Greeting
    addTextBlock(
        letter.salutation || "Dear Sir/Madam,",
        { gapAfter: 7 }
    );

    // Letter body, preserving paragraph breaks
    const paragraphs = String(letter.body || "")
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    for (const paragraph of paragraphs) {
        addTextBlock(paragraph, {
            fontSize: 11,
            gapAfter: 8,
        });
    }

    // Closing and signature
    addTextBlock(letter.closing || "Sincerely,", {
        gapAfter: 12,
    });

    addTextBlock(letter.signatureName || letter.senderName, {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(letter.signatureTitle, {
        color: [100, 116, 139],
        gapAfter: 4,
    });

    const filename = String(letter.title || "formiqo-letter")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
        .trim()
        .replace(/\s+/g, "-");

    pdf.save(`${filename}.pdf`);
}
