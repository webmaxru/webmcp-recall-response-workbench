import { describe, expect, it, vi } from "vitest";
import { AFFECTED_LOT, RECALL_ID, RecallWorkbench } from "./domain";
import {
  createWebMcpTools,
  registerWebMcpTools,
  resolveModelContext,
  type ModelContextLike,
  type WebMcpTool,
} from "./webmcp";

describe("WebMCP imperative registration", () => {
  it("requires a secure visible window and prefers document.modelContext", () => {
    const documentContext = { registerTool: vi.fn() } as ModelContextLike;
    const navigatorContext = { registerTool: vi.fn() } as ModelContextLike;
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    });
    document.modelContext = documentContext;
    navigator.modelContext = navigatorContext;
    expect(resolveModelContext()).toBe(documentContext);

    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: false,
    });
    expect(resolveModelContext()).toBeNull();

    delete document.modelContext;
    delete navigator.modelContext;
    Reflect.deleteProperty(window, "isSecureContext");
  });

  it("registers the complete atomic tool set once and cleans it up", async () => {
    const registered: WebMcpTool[] = [];
    const unregisterTool = vi.fn();
    const context: ModelContextLike = {
      registerTool: vi.fn(async (tool) => {
        registered.push(tool);
      }),
      unregisterTool,
    };
    const service = new RecallWorkbench();
    const tools = createWebMcpTools(service, async () => {});
    const lifecycle = registerWebMcpTools(context, tools);
    const outcome = await lifecycle.ready;
    expect(outcome.errors).toEqual([]);
    expect(outcome.names).toHaveLength(9);
    expect(outcome.names).toEqual(tools.map((tool) => tool.name));
    expect(registered[1].annotations).toEqual({
      readOnlyHint: false,
      untrustedContentHint: false,
    });
    lifecycle.dispose();
    expect(unregisterTool).toHaveBeenCalledTimes(9);
  });

  it("initiates every registration before any registration promise settles", async () => {
    const service = new RecallWorkbench();
    const tools = createWebMcpTools(service, async () => {});
    const resolvers: Array<() => void> = [];
    const context: ModelContextLike = {
      registerTool: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolvers.push(resolve);
          }),
      ),
    };

    const lifecycle = registerWebMcpTools(context, tools);

    expect(context.registerTool).toHaveBeenCalledTimes(9);
    expect(resolvers).toHaveLength(9);
    let settled = false;
    lifecycle.ready.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    resolvers.forEach((resolve) => resolve());
    await expect(lifecycle.ready).resolves.toMatchObject({
      names: tools.map((tool) => tool.name),
      errors: [],
      cancelled: false,
    });
  });

  it("validates input and commits mutating state synchronously", async () => {
    const service = new RecallWorkbench();
    const events: string[] = [];
    const waitForUi = vi.fn(async () => {});
    const commitUiMutation = <T,>(mutation: () => T) => {
      events.push("commit:start");
      const result = mutation();
      events.push(`state:${service.getSnapshot().stage}`);
      return result;
    };
    const tools = createWebMcpTools(service, waitForUi, commitUiMutation);
    const trace = tools.find((tool) => tool.name === "trace_affected_stock")!;
    await expect(
      trace.execute(
        { recallId: RECALL_ID, lot: "L24-019" },
        { signal: new AbortController().signal },
      ),
    ).rejects.toThrow(/not the affected lot/);
    events.length = 0;
    const result = await trace.execute(
      { recallId: RECALL_ID, lot: AFFECTED_LOT },
      { signal: new AbortController().signal },
    );
    events.push("returned");
    expect(result).toMatchObject({ exactMatches: 37, explicitlyExcluded: 213 });
    expect(events).toEqual(["commit:start", "state:stock-traced", "returned"]);
    expect(waitForUi).not.toHaveBeenCalled();
  });

  it("supports preview and polyfill callbacks without execute options", async () => {
    const service = new RecallWorkbench();
    const trace = createWebMcpTools(service, async () => {}).find(
      (tool) => tool.name === "trace_affected_stock",
    )!;

    await expect(
      trace.execute({ recallId: RECALL_ID, lot: AFFECTED_LOT }),
    ).resolves.toMatchObject({
      exactMatches: 37,
      explicitlyExcluded: 213,
    });
    expect(service.getSnapshot().stage).toBe("stock-traced");
  });

  it("does not wait on a deferred paint hook for mutating tools", async () => {
    const service = new RecallWorkbench();
    const waitForUi = vi.fn(() => new Promise<void>(() => {}));
    let commitCount = 0;
    const commitUiMutation = <T,>(mutation: () => T) => {
      commitCount += 1;
      return mutation();
    };
    const trace = createWebMcpTools(
      service,
      waitForUi,
      commitUiMutation,
    ).find(
      (tool) => tool.name === "trace_affected_stock",
    )!;

    await expect(
      trace.execute(
      { recallId: RECALL_ID, lot: AFFECTED_LOT },
      { signal: new AbortController().signal },
      ),
    ).resolves.toMatchObject({
      exactMatches: 37,
      explicitlyExcluded: 213,
    });
    expect(service.getSnapshot().stage).toBe("stock-traced");
    expect(commitCount).toBe(1);
    expect(waitForUi).not.toHaveBeenCalled();
  });

  it("returns corrective stage errors without re-registering tools", async () => {
    const service = new RecallWorkbench();
    const classify = createWebMcpTools(service, async () => {}).find(
      (tool) => tool.name === "classify_recall_actions",
    )!;

    await expect(
      classify.execute(
        { recallId: RECALL_ID, lot: AFFECTED_LOT },
        { signal: new AbortController().signal },
      ),
    ).rejects.toThrow(/Complete the preceding recall step first/);
    expect(service.getSnapshot().stage).toBe("case-ready");
  });

  it("rejects unknown fields instead of trusting additionalProperties", async () => {
    const service = new RecallWorkbench();
    const readCase = createWebMcpTools(service, async () => {}).find(
      (tool) => tool.name === "get_recall_case",
    )!;

    await expect(
      readCase.execute({
        recallId: RECALL_ID,
        ignored: true,
      }),
    ).rejects.toThrow("Unexpected input field: ignored");
  });

  it("exposes no tool that can perform the final consequential action", () => {
    const service = new RecallWorkbench();
    const allNames = createWebMcpTools(service, async () => {}).map(
      (tool) => tool.name,
    );
    expect(allNames).not.toContain("confirm_recall");
    expect(allNames).not.toContain("send_customer_outreach");
    expect(allNames).not.toContain("release_carrier_intercepts");
    expect(allNames).not.toContain("commit_inventory_quarantine");
    expect(allNames).toContain("get_recall_receipt");
  });

  it("marks every visible workflow transition as state-changing", () => {
    const service = new RecallWorkbench();
    const transitionNames = [
      "trace_affected_stock",
      "find_impacted_fulfillments",
      "classify_recall_actions",
      "preview_recall_scope",
      "stage_customer_and_carrier_response",
    ];
    const tools = createWebMcpTools(service, async () => {});

    transitionNames.forEach((name) => {
      const tool = tools.find(
        (candidate) => candidate.name === name,
      );
      expect(tool?.annotations.readOnlyHint).toBe(false);
    });
  });

  it("supports synchronous cleanup while async registration is pending", async () => {
    const service = new RecallWorkbench();
    const tool = createWebMcpTools(service, async () => {})[0];
    const activeNames = new Set<string>();
    let releaseFirst!: () => void;
    let firstCall = true;
    const context: ModelContextLike = {
      registerTool: vi.fn((candidate, options) => {
        if (activeNames.has(candidate.name)) {
          throw new DOMException("Duplicate tool name.", "InvalidStateError");
        }
        activeNames.add(candidate.name);
        options?.signal.addEventListener(
          "abort",
          () => activeNames.delete(candidate.name),
          { once: true },
        );
        if (firstCall) {
          firstCall = false;
          return new Promise<void>((resolve) => {
            releaseFirst = resolve;
          });
        }
      }),
      unregisterTool: (name) => {
        activeNames.delete(name);
      },
    };

    const first = registerWebMcpTools(context, [tool]);
    first.dispose();
    const second = registerWebMcpTools(context, [tool]);
    const secondOutcome = await second.ready;

    expect(secondOutcome.errors).toEqual([]);
    expect(secondOutcome.names).toEqual(["get_recall_case"]);
    releaseFirst();
    expect((await first.ready).cancelled).toBe(true);
    expect(activeNames).toEqual(new Set(["get_recall_case"]));
    second.dispose();
  });

  it("rolls back partial registration and reports all-or-nothing failure", async () => {
    const service = new RecallWorkbench();
    const tools = createWebMcpTools(service, async () => {}).slice(0, 3);
    const activeNames = new Set(["trace_affected_stock"]);
    const unregisterTool = vi.fn((name: string) => activeNames.delete(name));
    const signals: AbortSignal[] = [];
    const context: ModelContextLike = {
      registerTool: vi.fn((tool, options) => {
        if (options) signals.push(options.signal);
        if (activeNames.has(tool.name)) {
          throw new DOMException("Duplicate tool name.", "InvalidStateError");
        }
        activeNames.add(tool.name);
        options?.signal.addEventListener(
          "abort",
          () => activeNames.delete(tool.name),
          { once: true },
        );
      }),
      unregisterTool,
    };

    const outcome = await registerWebMcpTools(context, tools).ready;
    expect(outcome.names).toEqual([]);
    expect(outcome.errors).toHaveLength(1);
    expect(outcome.errors[0]).toMatch(/trace_affected_stock/);
    expect(context.registerTool).toHaveBeenCalledTimes(3);
    expect(unregisterTool).toHaveBeenCalledTimes(2);
    expect(unregisterTool).toHaveBeenCalledWith("get_recall_case");
    expect(unregisterTool).toHaveBeenCalledWith("find_impacted_fulfillments");
    expect(unregisterTool).not.toHaveBeenCalledWith("trace_affected_stock");
    expect(activeNames).toEqual(new Set(["trace_affected_stock"]));
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });
});
