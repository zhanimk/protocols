import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 1. ЖЕКЕ ЖҮКТЕУ (Бұрынғы функция)
export const exportToPDF = (elementId, fileName, controlsId) => {
  const input = document.getElementById(elementId);
  const controls = document.getElementById(controlsId);

  if (!input) return;
  if (controls) controls.style.display = "none";

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: 1400,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = 297;
    const pdfHeight = 210;

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;
    let renderWidth = pdfWidth;
    let renderHeight = renderWidth / ratio;

    if (renderHeight > pdfHeight) {
      renderHeight = pdfHeight;
      renderWidth = renderHeight * ratio;
    }

    const x = (pdfWidth - renderWidth) / 2;
    pdf.addImage(imgData, "PNG", x, 0, renderWidth, renderHeight);
    pdf.save(fileName);

    if (controls) controls.style.display = "flex";
  });
};

// 2. БАРЛЫҒЫН БІР PDF-КЕ ЖҮКТЕУ (ЖАҢА)
export const exportMultiPDF = async (elementsArray, fileName) => {
  // elementsArray = [{ id: "div-id-1" }, { id: "div-id-2" }]

  const pdf = new jsPDF("l", "mm", "a4");
  const pdfWidth = 297;
  const pdfHeight = 210;

  for (let i = 0; i < elementsArray.length; i++) {
    const elementId = elementsArray[i].id;
    const input = document.getElementById(elementId);

    if (input) {
      // Кезекпен суретке түсіреміз
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1400,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;

      let renderWidth = pdfWidth;
      let renderHeight = renderWidth / ratio;

      if (renderHeight > pdfHeight) {
        renderHeight = pdfHeight;
        renderWidth = renderHeight * ratio;
      }

      const x = (pdfWidth - renderWidth) / 2;

      // Екінші беттен бастап жаңа бет қосамыз
      if (i > 0) pdf.addPage();

      pdf.addImage(imgData, "PNG", x, 0, renderWidth, renderHeight);
    }
  }

  pdf.save(fileName);
};
