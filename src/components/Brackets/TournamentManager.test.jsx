import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TournamentManager from "./TournamentManager";
import { exportToPDF } from "../Utils/PdfExport";

jest.mock("../Utils/PdfExport", () => ({
  exportToPDF: jest.fn(() => Promise.resolve()),
}));

const participants = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  name: `P${i + 1}`,
  club: `Club${(i % 2) + 1}`,
}));

describe("TournamentManager", () => {
  test("calls exportToPDF with generated ids and filename", () => {
    render(<TournamentManager participants={participants} category="-38 кг" />);

    fireEvent.click(screen.getByText(/ЖҮКТЕУ \(PDF\)/i));

    expect(exportToPDF).toHaveBeenCalledTimes(1);
    const [printId, fileName, controlsId] = exportToPDF.mock.calls[0];

    expect(printId).toContain("print-area");
    expect(controlsId).toContain("controls");
    expect(fileName).toBe("Protocol_-38_кг_2026.pdf");
  });
});
