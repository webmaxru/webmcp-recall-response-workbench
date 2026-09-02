import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { AFFECTED_LOT, RECALL_ID, RecallWorkbench } from "./domain";
import { createWebMcpTools } from "./webmcp";

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("recall scope reveal", () => {
  it("keeps exact counts pending until the trace completes", () => {
    render(<App />);

    const exactMetric = screen.getByText("Exact recipients").closest("article")!;
    const excludedMetric = screen
      .getByText("Lookalikes excluded")
      .closest("article")!;

    expect(within(exactMetric).getByText("Pending")).toBeInTheDocument();
    expect(within(excludedMetric).getByText("Pending")).toBeInTheDocument();
    expect(screen.queryByText("37 matches")).not.toBeInTheDocument();
    expect(screen.queryByText("213 false positives prevented")).not.toBeInTheDocument();
    expect(screen.getByText("Inventory scope pending")).toBeInTheDocument();
    expect(screen.getByText("Carrier scope pending")).toBeInTheDocument();
    expect(screen.getByText("Customer scope pending")).toBeInTheDocument();
    expect(screen.queryByText("10 warehouse orders")).not.toBeInTheDocument();
    expect(screen.queryByText("9 in-transit orders")).not.toBeInTheDocument();
    expect(screen.queryByText("18 in-transit + delivered orders")).not.toBeInTheDocument();
  });

  it("reveals 37 and 213 when the same domain trace runs in rehearsal", () => {
    vi.useFakeTimers();
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /run guided rehearsal/i }));

    const exactMetric = screen.getByText("Exact recipients").closest("article")!;
    const excludedMetric = screen
      .getByText("Lookalikes excluded")
      .closest("article")!;
    expect(within(exactMetric).getByText("37")).toBeInTheDocument();
    expect(within(excludedMetric).getByText("213")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Find the right 37. Leave the other 8,383 alone.",
      }),
    ).toBeInTheDocument();

    unmount();
  });

  it("reveals review counts only after action classification", async () => {
    vi.useFakeTimers();
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /run guided rehearsal/i }));
    expect(screen.getByText("Inventory scope pending")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(screen.getByText("10 warehouse orders")).toBeInTheDocument();
    expect(screen.getByText("9 in-transit orders")).toBeInTheDocument();
    expect(screen.getByText("18 in-transit + delivered orders")).toBeInTheDocument();
    expect(screen.queryByText("Inventory scope pending")).not.toBeInTheDocument();
    unmount();
  });

  it("shows committed and released statuses after confirmation", async () => {
    vi.useFakeTimers();
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /run guided rehearsal/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2700);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm quarantine & release response/i,
      }),
    );

    const quarantineCard = screen
      .getByText("Inventory quarantine")
      .closest(".stage-card") as HTMLElement;
    const interceptCard = screen
      .getByText("Carrier intercept requests")
      .closest(".stage-card") as HTMLElement;
    const outreachCard = screen
      .getByText("Customer outreach drafts")
      .closest(".stage-card") as HTMLElement;
    expect(within(quarantineCard).getByText("Committed")).toBeInTheDocument();
    expect(within(interceptCard).getByText("Released")).toBeInTheDocument();
    expect(within(outreachCard).getByText("Released")).toBeInTheDocument();
    expect(within(quarantineCard).queryByText("Staged")).not.toBeInTheDocument();
    expect(within(interceptCard).queryByText("Staged")).not.toBeInTheDocument();
    expect(within(outreachCard).queryByText("Staged")).not.toBeInTheDocument();
    unmount();
  });

  it("flushes a mutating WebMCP transition before callback resolution", async () => {
    const service = new RecallWorkbench();
    const deferredPaint = vi.fn(() => new Promise<void>(() => {}));
    const commitUiMutation = <T,>(mutation: () => T) => {
      let result!: T;
      flushSync(() => {
        result = mutation();
      });
      return result;
    };
    function StageProbe() {
      const snapshot = useSyncExternalStore(
        service.subscribe,
        service.getSnapshot,
        service.getSnapshot,
      );
      return <output aria-label="probe stage">{snapshot.stage}</output>;
    }
    render(<StageProbe />);
    const trace = createWebMcpTools(
      service,
      deferredPaint,
      commitUiMutation,
    ).find((tool) => tool.name === "trace_affected_stock")!;

    await expect(
      trace.execute({ recallId: RECALL_ID, lot: AFFECTED_LOT }),
    ).resolves.toMatchObject({ exactMatches: 37 });

    expect(screen.getByLabelText("probe stage")).toHaveTextContent("stock-traced");
    expect(deferredPaint).not.toHaveBeenCalled();
  });
});
