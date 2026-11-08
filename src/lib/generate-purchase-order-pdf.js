
import autoTable from "jspdf-autotable";

export async function generatePurchaseOrderPdf(order) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    const green = [16, 185, 129];
    const dark = [31, 41, 55];
    const muted = [107, 114, 128];

    const currency = order.currency || "USD";

    const items = Array.isArray(order.items) ? order.items : [];

    const subtotal = items.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity || 0) *
            Number(item.price || 0),
        0
    );

    const tax = subtotal * (Number(order.taxRate || 0) / 100);
    const total = subtotal + tax;

    // Header
    pdf.setFillColor(...green);
    pdf.rect(0, 0, pageWidth, 5, "F");

    let y = 23;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(23);
    pdf.setTextColor(...dark);
    pdf.text("PURCHASE ORDER", margin, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...muted);
    pdf.text(
        `PO Number: ${order.orderNumber || "N/A"}`,
        pageWidth - margin,
        y,
        { align: "right" }
    );

    y += 8;

    pdf.setFontSize(9);
    pdf.text(
        `Order Date: ${order.orderDate || "N/A"}`,
        pageWidth - margin,
        y,
        { align: "right" }
    );

    y += 10;

    pdf.setDrawColor(220, 226, 232);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 12;

    // Buyer and supplier columns
    const columnGap = 12;
    const columnWidth = (contentWidth - columnGap) / 2;
    const rightColumn = margin + columnWidth + columnGap;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...green);
    pdf.text("BUYER", margin, y);
    pdf.text("SUPPLIER", rightColumn, y);

    y += 7;

    const buyerLines = [
        order.buyerName,
        order.buyerAddress,
        order.buyerEmail,
        order.buyerPhone,
    ].filter(Boolean);

    const supplierLines = [
        order.supplierName,
        order.supplierAddress,
        order.supplierEmail,
        order.supplierPhone,
    ].filter(Boolean);

    const drawColumn = (lines, x) => {
        let currentY = y;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...dark);

        lines.forEach((line) => {
            const wrapped = pdf.splitTextToSize(String(line), columnWidth);

            pdf.text(wrapped, x, currentY);
            currentY += wrapped.length * 5;
        });

        return currentY;
    };

    const buyerEnd = drawColumn(buyerLines, margin);
    const supplierEnd = drawColumn(supplierLines, rightColumn);

    y = Math.max(buyerEnd, supplierEnd) + 10;

    // Delivery information
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...dark);
    pdf.text("DELIVERY INFORMATION", margin, y);

    y += 7;

    const deliveryDetails = [
        ["Expected Delivery", order.deliveryDate],
        ["Shipping Address", order.shippingAddress],
        ["Payment Terms", order.paymentTerms],
    ].filter((item) => item[1]);

    deliveryDetails.forEach(([label, value]) => {
        const valueLines = pdf.splitTextToSize(
            String(value),
            contentWidth - 38
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(`${label}:`, margin, y);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...dark);
        pdf.text(valueLines, margin + 38, y);

        y += Math.max(6, valueLines.length * 5);
    });

    y += 8;

    // Items table
    autoTable(pdf, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [[
            "Description",
            "Quantity",
            "Unit Price",
            "Amount",
        ]],
        body: items.map((item) => {
            const quantity = Number(item.quantity || 0);
            const price = Number(item.price || 0);

            return [
                item.description || "Item",
                String(quantity),
                `${currency} ${price.toFixed(2)}`,
                `${currency} ${(quantity * price).toFixed(2)}`,
            ];
        }),
        theme: "grid",
        headStyles: {
            fillColor: green,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: {
            textColor: dark,
            fontSize: 9,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: "auto" },
            1: { halign: "center", cellWidth: 23 },
            2: { halign: "right", cellWidth: 35 },
            3: { halign: "right", cellWidth: 35 },
        },
    });

    y = pdf.lastAutoTable.finalY + 12;

    // Totals
    const totals = [
        ["Subtotal", subtotal],
        [`Tax (${Number(order.taxRate || 0)}%)`, tax],
        ["Grand Total", total],
    ];

    totals.forEach(([label, amount], index) => {
        if (y > pageHeight - 25) {
            pdf.addPage();
            y = 25;
        }

        pdf.setFont("helvetica", index === 2 ? "bold" : "normal");
        pdf.setFontSize(index === 2 ? 12 : 10);
        pdf.setTextColor(...(index === 2 ? green : dark));

        pdf.text(label, pageWidth - margin - 65, y);
        pdf.text(
            `${currency} ${Number(amount).toFixed(2)}`,
            pageWidth - margin,
            y,
            { align: "right" }
        );

        y += index === 2 ? 10 : 7;
    });

    // Notes
    if (order.notes?.trim()) {
        y += 8;

        if (y > pageHeight - 30) {
            pdf.addPage();
            y = 25;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);
        pdf.text("Notes & Instructions", margin, y);

        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);

        const noteLines = pdf.splitTextToSize(
            order.notes,
            contentWidth
        );

        noteLines.forEach((line) => {
            if (y > pageHeight - 20) {
                pdf.addPage();
                y = 25;
            }

            pdf.text(line, margin, y);
            y += 5;
        });
    }

    // Footer on every page
    const pageCount = pdf.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);

        pdf.setDrawColor(230, 230, 230);
        pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...muted);

        pdf.text(
            order.buyerName || "Purchase Order",
            margin,
            pageHeight - 8
        );

        pdf.text(
            `Page ${page} of ${pageCount}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: "right" }
        );
    }

    const filename = (order.orderNumber || "purchase-order")
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

    pdf.save(`${filename || "purchase-order"}.pdf`);
}
