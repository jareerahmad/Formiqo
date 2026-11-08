
import autoTable from "jspdf-autotable";

export async function generateReceiptPdf(receipt) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const left = 20;
    const right = pageWidth - 20;
    const contentWidth = right - left;

    let y = 22;

    const currency = receipt.currency || "USD";

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
            gapAfter = 5,
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

    // Receipt heading
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.setTextColor(31, 41, 55);
    pdf.text("PAYMENT RECEIPT", left, y);

    y += 12;

    addTextBlock(
        `Receipt Number: ${receipt.receiptNumber || "N/A"}`,
        { bold: true, gapAfter: 3 }
    );

    if (receipt.paymentDate) {
        addTextBlock(`Payment Date: ${receipt.paymentDate}`, {
            gapAfter: 3,
        });
    }

    if (receipt.paymentMethod) {
        addTextBlock(`Payment Method: ${receipt.paymentMethod}`, {
            gapAfter: 3,
        });
    }

    if (receipt.referenceNumber) {
        addTextBlock(
            `Transaction Reference: ${receipt.referenceNumber}`,
            { gapAfter: 8 }
        );
    }

    // Business details
    addTextBlock("RECEIVED BY", {
        bold: true,
        color: [5, 150, 105],
        gapAfter: 3,
    });

    addTextBlock(receipt.businessName || "Business Name", {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(receipt.businessAddress);
    addTextBlock(receipt.businessEmail, { gapAfter: 2 });

    if (receipt.businessPhone) {
        addTextBlock(receipt.businessPhone, { gapAfter: 5 });
    }

    // Customer details
    addTextBlock("PAYMENT RECEIVED FROM", {
        bold: true,
        color: [5, 150, 105],
        gapAfter: 3,
    });

    addTextBlock(receipt.customerName || "Customer Name", {
        bold: true,
        gapAfter: 2,
    });

    addTextBlock(receipt.customerAddress);
    addTextBlock(receipt.customerEmail, { gapAfter: 5 });

    // Payment items
    const items = Array.isArray(receipt.items)
        ? receipt.items
        : [];

    const validItems = items.filter(
        (item) => String(item.description || "").trim()
    );

    const subtotal = validItems.reduce(
        (sum, item) =>
            sum +
            (Number(item.quantity) || 0) *
            (Number(item.price) || 0),
        0
    );

    const discount = Math.max(
        0,
        Number(receipt.discount) || 0
    );

    const taxRate = Math.max(
        0,
        Number(receipt.taxRate) || 0
    );

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;

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
    ensureSpace(40);

    const totalsX = right - 65;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);

    pdf.text("Subtotal", totalsX, y);
    pdf.text(formatMoney(subtotal), right, y, {
        align: "right",
    });

    y += 7;

    pdf.text("Discount", totalsX, y);
    pdf.text(formatMoney(discount), right, y, {
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
    pdf.text("Amount Received", totalsX, y);
    pdf.text(formatMoney(total), right, y, {
        align: "right",
    });

    y += 13;

    // Payment status
    addTextBlock(
        `Payment Status: ${(receipt.paymentStatus || "Paid").toUpperCase()}`,
        {
            bold: true,
            color: [5, 150, 105],
            gapAfter: 5,
        }
    );

    if (receipt.notes?.trim()) {
        addTextBlock("NOTES", {
            bold: true,
            color: [5, 150, 105],
            gapAfter: 3,
        });

        addTextBlock(receipt.notes, {
            fontSize: 10,
            gapAfter: 8,
        });
    }

    addTextBlock(
        "Thank you for your payment. Please keep this receipt for your records.",
        {
            fontSize: 9,
            color: [107, 114, 128],
            gapAfter: 5,
        }
    );

    // Safe filename
    const filename = (
        receipt.title ||
        receipt.receiptNumber ||
        "Formiqo-Receipt"
    )
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    pdf.save(`${filename || "Formiqo-Receipt"}.pdf`);
}
