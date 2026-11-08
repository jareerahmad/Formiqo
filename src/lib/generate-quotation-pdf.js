import autoTable from "jspdf-autotable";

export async function generateQuotationPdf(quotation) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const left = 20;
    const right = pageWidth - 20;
    const contentWidth = right - left;

    let y = 22;

    const currency = quotation.currency || "USD";

    const formatMoney = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(Number(amount) || 0);

    function ensureSpace(height = 10) {
        if (y + height > pageHeight - 20) {
            pdf.addPage();
            y = 22;
        }
    }

    function addTextBlock(text, options = {}) {
        const {
            fontSize = 10,
            bold = false,
            color = [55, 65, 81],
            gapAfter = 6,
        } = options;

        if (!String(text ?? "").trim()) {
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

    // Formiqo branding
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(5, 150, 105);
    pdf.text("Formiqo", left, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text("Professional Documents", left, y + 7);

    pdf.setDrawColor(5, 150, 105);
    pdf.setLineWidth(0.7);
    pdf.line(left, y + 13, right, y + 13);

    y += 29;

    // Document heading
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text("QUOTATION", left, y);

    y += 12;

    addTextBlock(
        `Quotation Number: ${quotation.quotationNumber || "N/A"}`,
        { bold: true, gapAfter: 3 }
    );

    if (quotation.issueDate) {
        addTextBlock(`Issue Date: ${quotation.issueDate}`, {
            gapAfter: 3,
        });
    }

    if (quotation.validUntil) {
        addTextBlock(`Valid Until: ${quotation.validUntil}`, {
            gapAfter: 8,
        });
    }

    // Business and customer details
    addTextBlock("FROM", {
        fontSize: 10,
        bold: true,
        color: [5, 150, 105],
        gapAfter: 3,
    });

    addTextBlock(quotation.businessName || "Your Business Name", {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(quotation.businessAddress);
    addTextBlock(quotation.businessEmail, { gapAfter: 2 });

    if (quotation.businessPhone) {
        addTextBlock(quotation.businessPhone, { gapAfter: 5 });
    }

    addTextBlock("QUOTATION FOR", {
        fontSize: 10,
        bold: true,
        color: [5, 150, 105],
        gapAfter: 3,
    });

    addTextBlock(quotation.customerName || "Customer", {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(quotation.customerAddress);
    addTextBlock(quotation.customerEmail, { gapAfter: 2 });

    if (quotation.customerPhone) {
        addTextBlock(quotation.customerPhone, { gapAfter: 5 });
    }

    const items = Array.isArray(quotation.items)
        ? quotation.items
        : [];

    const validItems = items.filter(
        (item) => String(item.description || "").trim()
    );

    const subtotal = validItems.reduce((sum, item) => {
        return (
            sum +
            (Number(item.quantity) || 0) *
            (Number(item.price) || 0)
        );
    }, 0);

    const taxRate = Math.max(
        0,
        Number(quotation.taxRate) || 0
    );

    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Items table
    ensureSpace(24);

    autoTable(pdf, {
        startY: y,
        margin: { left, right: pageWidth - right },
        head: [["Description", "Qty", "Unit Price", "Amount"]],
        body: validItems.map((item) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;

            return [
                item.description,
                String(quantity),
                formatMoney(price),
                formatMoney(quantity * price),
            ];
        }),
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 3,
            textColor: [55, 65, 81],
            lineColor: [229, 231, 235],
            lineWidth: 0.2,
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: [5, 150, 105],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 18, halign: "center" },
            2: { cellWidth: 35, halign: "right" },
            3: { cellWidth: 35, halign: "right" },
        },
    });

    y = pdf.lastAutoTable.finalY + 10;

    // Totals
    ensureSpace(35);

    const totalsX = right - 65;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text("Subtotal", totalsX, y);
    pdf.text(formatMoney(subtotal), right, y, {
        align: "right",
    });

    y += 7;

    pdf.text(`Tax (${taxRate}%)`, totalsX, y);
    pdf.text(formatMoney(tax), right, y, {
        align: "right",
    });

    y += 4;

    pdf.setDrawColor(5, 150, 105);
    pdf.line(totalsX, y, right, y);

    y += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(5, 150, 105);
    pdf.text("Total", totalsX, y);
    pdf.text(formatMoney(total), right, y, {
        align: "right",
    });

    y += 15;

    // Notes and terms
    if (quotation.notes?.trim()) {
        addTextBlock("NOTES & TERMS", {
            bold: true,
            color: [5, 150, 105],
            gapAfter: 3,
        });

        addTextBlock(quotation.notes, {
            fontSize: 10,
            gapAfter: 8,
        });
    }

    addTextBlock(
        "Thank you for considering our quotation. Please contact us if you have any questions.",
        {
            fontSize: 9,
            color: [107, 114, 128],
            gapAfter: 5,
        }
    );

    // Filename
    const filename = (
        quotation.title ||
        quotation.quotationNumber ||
        "Formiqo-Quotation"
    )
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    pdf.save(`${filename || "Formiqo-Quotation"}.pdf`);
}
