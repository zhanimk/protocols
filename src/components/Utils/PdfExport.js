import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = (elementId, fileName, controlsId) => {
  const input = document.getElementById(elementId);
  const controls = document.getElementById(controlsId);

  if (!input) return;
  if (controls) controls.style.display = "none";

  html2canvas(input, {
    scale: 3, // Өте анық шығуы үшін
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: input.offsetWidth,
    height: input.offsetHeight,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4"); // "l" - landscape

    // Парақты шетінен шетіне дейін толтыру
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
    pdf.save(fileName);

    if (controls) controls.style.display = "flex";
  });
};
