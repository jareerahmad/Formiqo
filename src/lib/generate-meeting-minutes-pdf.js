
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateMeetingMinutesPdf = (minutes) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    const addWrappedText = (text, x, startY, width, fontSize = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text || "-", width);
        pdf.text(lines, x, startY);
        return startY + lines.length * (fontSize * 0.48) + 5;
    };

    const addSection = (heading, content) => {
        if (!content) return;

        if (y > pageHeight - 35) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(16, 120, 85);
        pdf.text(heading, margin, y);
        y += 8;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(55, 65, 81);
        y = addWrappedText(content, margin, y, contentWidth, 10);
        y += 3;
    };

    pdf.setFillColor(16, 120, 85);
    pdf.rect(0, 0, pageWidth, 9, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(25, 35, 30);
    pdf.text(minutes.title || "Meeting Minutes", margin, 27);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(110, 110, 110);
    pdf.text(
        `Meeting No: ${minutes.meetingNumber || "-"}  |  Date: ${minutes.meetingDate || "-"}`,
        margin,
        35
    );

    y = 49;

    const details = [
        ["Meeting Time", minutes.meetingTime],
        ["Location", minutes.location],
        ["Meeting Type", minutes.meetingType],
        ["Organizer", minutes.organizer],
        ["Chairperson", minutes.chairperson],
        ["Attendees", minutes.attendees],
        ["Apologies", minutes.apologies],
        ["Prepared By", minutes.preparedBy],
    ].filter((item) => item[1]);

    autoTable(pdf, {
        startY: y,
        head: [["Meeting Details", "Information"]],
        body: details,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [16, 120, 85] },
        columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" } },
    });

    y = pdf.lastAutoTable.finalY + 12;

    addSection("Meeting Agenda", minutes.agenda);
    addSection("Discussion Summary", minutes.discussion);
    addSection("Key Decisions", minutes.decisions);

    if (minutes.actionItems?.length) {
        if (y > pageHeight - 55) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(16, 120, 85);
        pdf.text("Action Items", margin, y);
        y += 5;

        autoTable(pdf, {
            startY: y,
            head: [["Task", "Assigned To", "Due Date", "Status"]],
            body: minutes.actionItems.map((item) => [
                item.task || "-",
                item.assignedTo || "-",
                item.dueDate || "-",
                item.status || "Pending",
            ]),
            theme: "grid",
            margin: { left: margin, right: margin },
            styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
            headStyles: { fillColor: [16, 120, 85] },
        });

        y = pdf.lastAutoTable.finalY + 10;
    }

    addSection("Next Meeting", minutes.nextMeeting);
    addSection("Additional Notes", minutes.notes);

    const totalPages = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(130, 130, 130);
        pdf.text(
            `Generated with Formiqo  |  Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
    }

    const fileName = (minutes.title || "meeting-minutes")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    pdf.save(`${fileName || "meeting-minutes"}.pdf`);
};
