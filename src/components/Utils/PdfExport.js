import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const captureCanvas = async (element) => {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });
};

export const exportToPDF = async (elementId, fileName, controlsId) => {
  const input = document.getElementById(elementId);
  const controls = controlsId ? document.getElementById(controlsId) : null;

  if (!input) return;
  if (controls) controls.style.display = "none";

  try {
    const canvas = await captureCanvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
    pdf.save(fileName);
  } finally {
    if (controls) controls.style.display = "flex";
  }
};

export const exportMultiPDF = async (elements = [], fileName = "protocols.pdf") => {
  if (!elements.length) return;

  const pdf = new jsPDF("l", "mm", "a4");
  let hasPage = false;

  for (const item of elements) {
    const input = document.getElementById(item.id);
    if (!input) continue;

    const canvas = await captureCanvas(input);
    const imgData = canvas.toDataURL("image/png");

    if (hasPage) {
      pdf.addPage("a4", "landscape");
    }

    pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
    hasPage = true;
  }

  if (hasPage) {
    pdf.save(fileName);
  }
};
