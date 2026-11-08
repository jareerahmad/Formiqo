
export async function generateCVPdf(cv) {
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();

    const left = 18;
    const right = 192;
    let y = 22;

    function ensureSpace(height = 10) {
        if (y + height > 280) {
            pdf.addPage();
            y = 20;
        }
    }

    function addSection(title, content) {
        if (!String(content || "").trim()) return;

        ensureSpace(18);
        y += 5;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(5, 150, 105);
        pdf.text(title.toUpperCase(), left, y);

        y += 3;
        pdf.setDrawColor(209, 250, 229);
        pdf.line(left, y, right, y);
        y += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);

        const lines = pdf.splitTextToSize(
            String(content).trim(),
            right - left
        );

        for (const line of lines) {
            ensureSpace(6);
            pdf.text(line, left, y);
            y += 5;
        }
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(5, 150, 105);
    pdf.text(String(cv.fullName || "Your Name"), left, y);

    y += 9;

    if (cv.jobTitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(13);
        pdf.setTextColor(45, 55, 72);
        pdf.text(String(cv.jobTitle), left, y);
        y += 8;
    }

    const contact = [
        cv.email,
        cv.phone,
        cv.location,
        cv.website,
    ].filter(Boolean);

    if (contact.length) {
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);

        const lines = pdf.splitTextToSize(
            contact.join("  |  "),
            right - left
        );

        pdf.text(lines, left, y);
        y += lines.length * 5 + 4;
    }

    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.7);
    pdf.line(left, y, right, y);

    addSection("Professional Summary", cv.summary);
    addSection("Work Experience", cv.experience);
    addSection("Education", cv.education);
    addSection("Skills", cv.skills);
    addSection("Projects & Achievements", cv.projects);

    const filename = String(cv.fullName || "formiqo-cv")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
        .replace(/\s+/g, "-");

    pdf.save(`${filename}-CV.pdf`);
}
