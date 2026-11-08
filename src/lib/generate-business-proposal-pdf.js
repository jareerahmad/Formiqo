
export async function generateBusinessProposalPdf(proposal) {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    const green = [16, 185, 129];
    const dark = [31, 41, 55];
    const muted = [107, 114, 128];

    let y = 25;

    const addPageIfNeeded = (height = 10) => {
        if (y + height > pageHeight - 20) {
            pdf.addPage();
            y = 25;
        }
    };

    const addSection = (heading, content) => {
        if (!content?.trim()) return;

        addPageIfNeeded(20);

        y += 8;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(...green);
        pdf.text(heading, margin, y);

        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...dark);

        const paragraphs = content.split("\n").filter(Boolean);

        paragraphs.forEach((paragraph) => {
            const lines = pdf.splitTextToSize(paragraph, contentWidth);

            addPageIfNeeded(lines.length * 5 + 4);

            pdf.text(lines, margin, y);
            y += lines.length * 5 + 4;
        });
    };

    // Top accent
    pdf.setFillColor(...green);
    pdf.rect(0, 0, pageWidth, 5, "F");

    // Proposal title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(23);
    pdf.setTextColor(...dark);

    const title = proposal.title || "Business Proposal";
    const titleLines = pdf.splitTextToSize(title, contentWidth);

    pdf.text(titleLines, margin, y);
    y += titleLines.length * 10 + 3;

    // Subtitle
    if (proposal.subtitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(...muted);

        const subtitleLines = pdf.splitTextToSize(
            proposal.subtitle,
            contentWidth
        );

        pdf.text(subtitleLines, margin, y);
        y += subtitleLines.length * 6 + 5;
    }

    // Divider
    pdf.setDrawColor(220, 226, 232);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Proposal details
    const details = [
        ["Prepared by", proposal.businessName],
        ["Prepared for", proposal.clientName],
        ["Date", proposal.date],
        ["Valid until", proposal.validUntil],
    ].filter((item) => item[1]);

    details.forEach(([label, value]) => {
        addPageIfNeeded(8);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(`${label}:`, margin, y);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...dark);

        const valueLines = pdf.splitTextToSize(
            String(value),
            contentWidth - 35
        );

        pdf.text(valueLines, margin + 35, y);
        y += Math.max(6, valueLines.length * 5);
    });

    // Contact information
    const contact = [
        proposal.businessEmail,
        proposal.businessPhone,
        proposal.businessAddress,
    ].filter(Boolean);

    if (contact.length) {
        y += 3;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);

        const contactLines = pdf.splitTextToSize(
            contact.join(" | "),
            contentWidth
        );

        addPageIfNeeded(contactLines.length * 5);
        pdf.text(contactLines, margin, y);
        y += contactLines.length * 5;
    }

    // Proposal content sections
    addSection("1. Executive Summary", proposal.executiveSummary);
    addSection("2. Project Objectives", proposal.objectives);
    addSection("3. Scope of Work", proposal.scopeOfWork);
    addSection("4. Deliverables", proposal.deliverables);
    addSection("5. Project Timeline", proposal.timeline);
    addSection("6. Investment & Pricing", proposal.pricing);
    addSection("7. Terms & Conditions", proposal.terms);
    addSection("8. Additional Notes", proposal.notes);

    // Signature section
    if (proposal.signatureName || proposal.signatureTitle) {
        addPageIfNeeded(35);
        y += 10;

        pdf.setDrawColor(220, 226, 232);
        pdf.line(margin, y, margin + 65, y);

        y += 8;

        if (proposal.signatureName) {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(...dark);
            pdf.text(proposal.signatureName, margin, y);
            y += 6;
        }

        if (proposal.signatureTitle) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(...muted);
            pdf.text(proposal.signatureTitle, margin, y);
        }
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
            proposal.businessName || "Business Proposal",
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

    const filename = (proposal.title || "business-proposal")
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

    pdf.save(`${filename || "business-proposal"}.pdf`);
}
