
export async function generateInvoicePdf(invoiceData) {
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();

    const invoice = invoiceData;
    const items = Array.isArray(invoice.items) ? invoice.items : [];

    const money = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: invoice.currency || "USD",
        }).format(Number(value) || 0);

    const subtotal = items.reduce((sum, item) => {
        const quantity = Math.max(0, Number(item.quantity) || 0);
        const price = Math.max(0, Number(item.price) || 0);
        return sum + quantity * price;
    }, 0);

    const taxRate = Math.max(0, Number(invoice.taxRate) || 0);
    const tax = subtotal * taxRate / 100;
    const total = subtotal + tax;

    const left = 16;
    const right = 194;
    let y = 20;

    const ensureSpace = (height = 10) => {
        if (y + height > 280) {
            pdf.addPage();
            y = 20;
        }
    };

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(5, 150, 105);
    pdf.text("Formiqo", left, y);

    pdf.setTextColor(25, 25, 25);
    pdf.setFontSize(21);
    pdf.text("INVOICE", right, y, { align: "right" });

    y += 12;
    pdf.setDrawColor(16, 185, 129);
    pdf.line(left, y, right, y);
    y += 12;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Invoice number:", left, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(invoice.invoiceNumber || "—"), 55, y);

    pdf.setFont("helvetica", "bold");
    pdf.text("Issue date:", 115, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(invoice.issueDate || "—"), right, y, {
        align: "right",
    });

    y += 7;
    pdf.setFont("helvetica", "bold");
    pdf.text("Due date:", 115, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(String(invoice.dueDate || "—"), right, y, {
        align: "right",
    });

    y += 13;
    pdf.setFont("helvetica", "bold");
    pdf.text("FROM", left, y);
    pdf.text("BILL TO", 110, y);
    y += 7;

    pdf.setFont("helvetica", "normal");

    const businessLines = [
        invoice.businessName,
        invoice.businessEmail,
        invoice.businessAddress,
    ].filter(Boolean);

    const customerLines = [
        invoice.customerName,
        invoice.customerEmail,
        invoice.customerAddress,
    ].filter(Boolean);

    const businessText = pdf.splitTextToSize(
        businessLines.join("\n") || "Your business details",
        80
    );

    const customerText = pdf.splitTextToSize(
        customerLines.join("\n") || "Customer details",
        80
    );

    const fromHeight = businessText.length * 5;
    const toHeight = customerText.length * 5;

    pdf.text(businessText, left, y);
    pdf.text(customerText, 110, y);

    y += Math.max(fromHeight, toHeight) + 10;
    ensureSpace(20);

    pdf.setFillColor(236, 253, 245);
    pdf.rect(left, y - 5, right - left, 10, "F");

    pdf.setFont("helvetica", "bold");
    pdf.text("Description", left + 2, y + 1);
    pdf.text("Qty", 125, y + 1, { align: "right" });
    pdf.text("Price", 158, y + 1, { align: "right" });
    pdf.text("Amount", right - 2, y + 1, { align: "right" });

    y += 12;
    pdf.setFont("helvetica", "normal");

    for (const item of items) {
        const description = pdf.splitTextToSize(
            String(item.description || "Item"),
            90
        );

        const rowHeight = Math.max(8, description.length * 5);
        ensureSpace(rowHeight + 3);

        pdf.text(description, left + 2, y);
        pdf.text(String(Number(item.quantity) || 0), 125, y, {
            align: "right",
        });
        pdf.text(money(Number(item.price) || 0), 158, y, {
            align: "right",
        });
        pdf.text(
            money(
                Math.max(0, Number(item.quantity) || 0) *
                Math.max(0, Number(item.price) || 0)
            ),
            right - 2,
            y,
            { align: "right" }
        );

        y += rowHeight + 3;
    }

    y += 7;
    ensureSpace(35);

    pdf.line(115, y, right, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Subtotal", 145, y, { align: "right" });
    pdf.text(money(subtotal), right, y, { align: "right" });
    y += 7;

    pdf.text(`Tax (${taxRate}%)`, 145, y, { align: "right" });
    pdf.text(money(tax), right, y, { align: "right" });
    y += 9;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("TOTAL", 145, y, { align: "right" });
    pdf.text(money(total), right, y, { align: "right" });

    if (invoice.notes) {
        y += 16;
        ensureSpace(20);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Notes", left, y);

        y += 6;
        pdf.setFont("helvetica", "normal");

        const noteLines = pdf.splitTextToSize(
            String(invoice.notes),
            right - left
        );

        for (const line of noteLines) {
            ensureSpace(6);
            pdf.text(line, left, y);
            y += 5;
        }
    }

    const filename = String(
        invoice.invoiceNumber || "formiqo-invoice"
    ).replace(/[<>:"/\\|?*\x00-\x1F]/g, "-");

    pdf.save(`${filename}.pdf`);
}
