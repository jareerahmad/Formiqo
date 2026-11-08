
export async function generatePaymentReminderPdf(reminder) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    const currency = reminder.currency || "USD";

    pdf.setFillColor(5, 150, 105);
    pdf.rect(0, 0, pageWidth, 48, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("PAYMENT REMINDER", margin, 22);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("PAYMENT NOTICE", margin, 32);

    pdf.setFontSize(9);
    pdf.text(
        `Reminder #: ${reminder.reminderNumber || "—"}`,
        pageWidth - margin,
        20,
        { align: "right" }
    );
    pdf.text(
        `Date: ${reminder.reminderDate || "—"}`,
        pageWidth - margin,
        29,
        { align: "right" }
    );

    let y = 64;

    const addLabel = (label, value) => {
        if (!value) return;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(5, 100, 75);
        pdf.text(label.toUpperCase(), margin, y);

        y += 6;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);

        const lines = pdf.splitTextToSize(String(value), contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 7;
    };

    addLabel("From / Business", reminder.businessName);
    addLabel("Business Address", reminder.businessAddress);
    addLabel("Business Email", reminder.businessEmail);
    addLabel("Bill To / Customer", reminder.customerName);
    addLabel("Customer Address", reminder.customerAddress);
    addLabel("Customer Email", reminder.customerEmail);

    y += 2;

    pdf.setDrawColor(220, 230, 225);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 13;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(31, 41, 55);
    pdf.text("Payment Details", margin, y);
    y += 10;

    const details = [
        ["Invoice Number", reminder.invoiceNumber],
        ["Invoice Date", reminder.invoiceDate],
        ["Due Date", reminder.dueDate],
        ["Payment Terms", reminder.paymentTerms],
        ["Payment Status", reminder.paymentStatus],
    ];

    details.forEach(([label, value]) => {
        if (!value) return;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        pdf.text(label, margin, y);

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text(String(value), margin + 48, y);

        y += 8;
    });

    y += 8;

    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(
        margin,
        y,
        contentWidth,
        29,
        3,
        3,
        "F"
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(5, 100, 75);
    pdf.text("OUTSTANDING AMOUNT", margin + 6, y + 10);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.setTextColor(5, 100, 75);
    pdf.text(
        `${currency} ${Number(reminder.amountDue || 0).toFixed(2)}`,
        margin + 6,
        y + 21
    );

    y += 43;

    if (reminder.subject) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Subject", margin, y);
        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        const subjectLines = pdf.splitTextToSize(
            reminder.subject,
            contentWidth
        );
        pdf.text(subjectLines, margin, y);
        y += subjectLines.length * 5 + 8;
    }

    if (reminder.message) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Message", margin, y);
        y += 8;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);

        const messageLines = pdf.splitTextToSize(
            reminder.message,
            contentWidth
        );

        messageLines.forEach((line) => {
            if (y > 270) {
                pdf.addPage();
                y = 22;
            }

            pdf.text(line, margin, y);
            y += 5;
        });

        y += 8;
    }

    if (reminder.paymentInstructions) {
        if (y > 255) {
            pdf.addPage();
            y = 22;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(5, 100, 75);
        pdf.text("Payment Instructions", margin, y);
        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99);

        const instructions = pdf.splitTextToSize(
            reminder.paymentInstructions,
            contentWidth
        );

        instructions.forEach((line) => {
            if (y > 270) {
                pdf.addPage();
                y = 22;
            }

            pdf.text(line, margin, y);
            y += 5;
        });

        y += 8;
    }

    if (reminder.signatureName) {
        if (y > 255) {
            pdf.addPage();
            y = 22;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text(reminder.signatureName, margin, y);

        if (reminder.signatureTitle) {
            y += 6;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(107, 114, 128);
            pdf.text(reminder.signatureTitle, margin, y);
        }
    }

    const pageCount = pdf.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
            `Generated with Formiqo | Page ${page} of ${pageCount}`,
            pageWidth / 2,
            287,
            { align: "center" }
        );
    }

    const safeName = (reminder.title || "payment_reminder")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

    pdf.save(`${safeName}.pdf`);
}
