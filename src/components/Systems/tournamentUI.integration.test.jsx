import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Olympic8 from "./Olympic8";
import Olympic16 from "./Olympic16";
import RoundRobin from "./RoundRobin";

const createParticipants = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `A${i + 1}`,
    club: `Club${(i % 3) + 1}`,
  }));

const Harness = ({ Component, participants }) => {
  const [results, setResults] = useState({});

  return (
    <>
      <Component
        participants={participants}
        category="-30"
        results={results}
        setResults={setResults}
      />
      <div data-testid="results-state">{JSON.stringify(results)}</div>
    </>
  );
};

const getResultsState = () => {
  const raw = screen.getByTestId("results-state").textContent || "{}";
  return JSON.parse(raw);
};

describe("Tournament UI integration", () => {
  test("Olympic8: clicking a competitor stores winner for the match", () => {
    render(<Harness Component={Olympic8} participants={createParticipants(8)} />);

    fireEvent.click(screen.getByText("A1"));

    const state = getResultsState();
    expect(state["r1-0"]).toBeTruthy();
    expect(state["r1-0"].name).toBe("A1");
  });

  test("Olympic16: BYE paths auto-advance competitors", async () => {
    render(<Harness Component={Olympic16} participants={createParticipants(9)} />);

    await waitFor(() => {
      const state = getResultsState();
      const winKeys = Object.keys(state).filter(
        (key) => key.startsWith("r") && !key.endsWith("_loser")
      );
      expect(winKeys.length).toBeGreaterThan(0);
    });
  });

  test("RoundRobin: for 4 participants renders 6 fights", () => {
    render(<RoundRobin participants={createParticipants(4)} category="-30" />);

    expect(screen.getAllByText(/БЕЛДЕСУ №/i)).toHaveLength(6);
  });
});
