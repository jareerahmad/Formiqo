
import autoTable from "jspdf-autotable";

export async function generateExpenseReportPdf(report) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const currency = report.currency || "USD";
    const expenses = Array.isArray(report.expenses) ? report.expenses : [];

    const subtotal = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
    );

    const title = report.title || "Expense Report";

    pdf.setFillColor(5, 150, 105);
    pdf.rect(0, 0, pageWidth, 42, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(title, margin, 19);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("EXPENSE REPORT", margin, 29);

    pdf.setFontSize(9);
    pdf.text(
        `Report #: ${report.reportNumber || "—"}`,
        pageWidth - margin,
        18,
        { align: "right" }
    );
    pdf.text(
        `Date: ${report.reportDate || "—"}`,
        pageWidth - margin,
        26,
        { align: "right" }
    );

    let y = 54;

    const addSection = (heading, value) => {
        if (!value) return;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(5, 100, 75);
        pdf.text(heading, margin, y);
        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81);

        const lines = pdf.splitTextToSize(String(value), contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 7;
    };

    addSection("Employee / Submitted By", report.employeeName);
    addSection("Department", report.department);
    addSection("Employee Email", report.employeeEmail);
    addSection("Reporting Period", report.reportingPeriod);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(31, 41, 55);
    pdf.text("Expense Details", margin, y);
    y += 5;

    autoTable(pdf, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["Date", "Category", "Description", "Amount"]],
        body: expenses.map((expense) => [
            expense.date || "—",
            expense.category || "Other",
            expense.description || "—",
            `${currency} ${Number(expense.amount || 0).toFixed(2)}`,
        ]),
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 3,
            textColor: [55, 65, 81],
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: [5, 150, 105],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        columnStyles: {
            3: { halign: "right" },
        },
    });

    let finalY = pdf.lastAutoTable.finalY + 12;

    if (finalY > 245) {
        pdf.addPage();
        finalY = 25;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(5, 100, 75);
    pdf.text("Total Expenses", pageWidth - margin - 55, finalY);
    pdf.text(
        `${currency} ${subtotal.toFixed(2)}`,
        pageWidth - margin,
        finalY,
        { align: "right" }
    );

    finalY += 12;

    if (report.notes) {
        if (finalY > 255) {
            pdf.addPage();
            finalY = 25;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Additional Notes", margin, finalY);
        finalY += 6;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99);

        const noteLines = pdf.splitTextToSize(report.notes, contentWidth);
        pdf.text(noteLines, margin, finalY);
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

    const safeName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    pdf.save(`${safeName || "expense_report"}.pdf`);
}
