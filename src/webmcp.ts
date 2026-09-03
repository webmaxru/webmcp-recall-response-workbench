import {
  AFFECTED_LOT,
  RECALL_ID,
  type RecallWorkbench,
} from "./domain";

export type ToolExecuteOptions = { signal: AbortSignal };

export type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: boolean;
    untrustedContentHint: boolean;
  };
  execute: (
    input: Record<string, unknown>,
    options?: ToolExecuteOptions,
  ) => Promise<unknown>;
};

export type ModelContextLike = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
  unregisterTool?: (name: string) => void;
};

declare global {
  interface Document {
    modelContext?: ModelContextLike;
  }
  interface Navigator {
    modelContext?: ModelContextLike;
  }
}

const caseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recallId: {
      type: "string",
      description: `Selected recall identifier. Use ${RECALL_ID}.`,
    },
  },
  required: ["recallId"],
} as const;

const exactLotSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recallId: {
      type: "string",
      description: `Selected recall identifier. Use ${RECALL_ID}.`,
    },
    lot: {
      type: "string",
      description: `Exact supplier lot. Use ${AFFECTED_LOT}.`,
    },
  },
  required: ["recallId", "lot"],
} as const;

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw signal.reason ?? new DOMException("Tool execution aborted.", "AbortError");
  }
}

function assertOnlyKeys(
  input: Record<string, unknown>,
  allowedKeys: readonly string[],
) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Tool input must be a JSON object.");
  }
  const unexpected = Object.keys(input).filter((key) => !allowedKeys.includes(key));
  if (unexpected.length > 0) {
    throw new Error(
      `Unexpected input field${unexpected.length === 1 ? "" : "s"}: ${unexpected.join(
        ", ",
      )}. Allowed fields: ${allowedKeys.join(", ")}.`,
    );
  }
}

function readString(input: Record<string, unknown>, key: string) {
  const value = input[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`"${key}" must be a non-empty string.`);
  }
  return value;
}

export function resolveModelContext(): ModelContextLike | null {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    window.isSecureContext === false
  ) {
    return null;
  }

  const modelContext = document.modelContext || navigator.modelContext;
  return modelContext || null;
}

export function createWebMcpTools(
  service: RecallWorkbench,
  waitForUi: () => Promise<void>,
  commitUiMutation: <T>(mutation: () => T) => T = (mutation) => mutation(),
): WebMcpTool[] {
  const runReadOnly =
    (
      action: (input: Record<string, unknown>) => unknown,
    ): WebMcpTool["execute"] =>
    async (input, options) => {
      const signal = options?.signal;
      throwIfAborted(signal);
      const output = action(input);
      await waitForUi();
      throwIfAborted(signal);
      return output;
    };

  const runMutation =
    (
      action: (input: Record<string, unknown>) => unknown,
    ): WebMcpTool["execute"] =>
    async (input, options) => {
      throwIfAborted(options?.signal);
      return commitUiMutation(() => action(input));
    };

  return [
    {
      name: "get_recall_case",
      title: "Read recall case",
      description:
        "Read the selected product recall case, its exact affected lot, confusable lot, severity, and candidate order count.",
      inputSchema: caseSchema,
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: runReadOnly((input) => {
        assertOnlyKeys(input, ["recallId"]);
        return service.getRecallCase(readString(input, "recallId"));
      }),
    },
    {
      name: "trace_affected_stock",
      title: "Trace exact affected stock",
      description:
        "Trace the selected recall across all candidate orders using an exact lot match and explicitly report excluded lookalike-lot orders.",
      inputSchema: exactLotSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot"]);
        return service.traceAffectedStock(
          readString(input, "recallId"),
          readString(input, "lot"),
        );
      }),
    },
    {
      name: "find_impacted_fulfillments",
      title: "Find impacted fulfillments",
      description:
        "Resolve exact-lot orders into warehouse, in-transit, delivered, and already-returned fulfillment states.",
      inputSchema: exactLotSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot"]);
        return service.findImpactedFulfillments(
          readString(input, "recallId"),
          readString(input, "lot"),
        );
      }),
    },
    {
      name: "classify_recall_actions",
      title: "Classify recall actions",
      description:
        "Classify every exact-lot fulfillment into one mutually exclusive response action without committing operational changes.",
      inputSchema: exactLotSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot"]);
        return service.classifyRecallActions(
          readString(input, "recallId"),
          readString(input, "lot"),
        );
      }),
    },
    {
      name: "preview_recall_scope",
      title: "Preview recall scope",
      description:
        "Open the visible review scope for the exact recipients, lookalike exclusions, and classified actions; makes no durable change.",
      inputSchema: exactLotSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot"]);
        return service.previewRecallScope(
          readString(input, "recallId"),
          readString(input, "lot"),
        );
      }),
    },
    {
      name: "stage_inventory_quarantine",
      title: "Stage inventory quarantine",
      description:
        "Stage, but do not commit, quarantine instructions for exact-lot warehouse inventory in the visible review panel.",
      inputSchema: exactLotSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot"]);
        return service.stageInventoryQuarantine(
          readString(input, "recallId"),
          readString(input, "lot"),
        );
      }),
    },
    {
      name: "stage_customer_and_carrier_response",
      title: "Stage customer and carrier response",
      description:
        "Stage, but do not release, nine carrier intercept requests for in-transit exact-lot orders and eighteen customer outreach drafts for in-transit and delivered exact-lot orders.",
      inputSchema: {
        ...exactLotSchema,
        properties: {
          ...exactLotSchema.properties,
          template: {
            type: "string",
            enum: ["precautionary-recall-v1"],
            description: "Approved outreach template.",
          },
        },
        required: ["recallId", "lot", "template"],
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId", "lot", "template"]);
        return service.stageCustomerAndCarrierResponse(
          readString(input, "recallId"),
          readString(input, "lot"),
          readString(input, "template"),
        );
      }),
    },
    {
      name: "cancel_staged_recall",
      title: "Cancel staged recall plan",
      description:
        "Clear the visible, uncommitted quarantine and outreach drafts for this recall case.",
      inputSchema: caseSchema,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: runMutation((input) => {
        assertOnlyKeys(input, ["recallId"]);
        return service.cancelStagedRecall(readString(input, "recallId"));
      }),
    },
    {
      name: "get_recall_receipt",
      title: "Read confirmation receipt",
      description:
        "Read the confirmed receipt for the current in-memory rehearsal, including the deterministic demo checksum; reset starts a new rehearsal and clears it.",
      inputSchema: caseSchema,
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: runReadOnly((input) => {
        assertOnlyKeys(input, ["recallId"]);
        return service.getReceipt(readString(input, "recallId"));
      }),
    },
  ];
}

type RegistrationOutcome = {
  names: string[];
  errors: string[];
  cancelled: boolean;
};

export function registerWebMcpTools(
  modelContext: ModelContextLike,
  tools: WebMcpTool[],
) {
  const controller = new AbortController();
  const registeredNames = new Set<string>();
  let disposed = false;
  let cleaned = false;
  let resolveCancellation!: (outcome: RegistrationOutcome) => void;
  const cancellation = new Promise<RegistrationOutcome>((resolve) => {
    resolveCancellation = resolve;
  });

  const cleanupRegistrations = () => {
    if (cleaned) return;
    cleaned = true;
    const names = tools
      .map((tool) => tool.name)
      .filter((name) => registeredNames.has(name))
      .reverse();
    registeredNames.clear();
    for (const name of names) {
      try {
        modelContext.unregisterTool?.(name);
      } catch {
        // Signal cleanup below is the current lifecycle mechanism.
      }
    }
    controller.abort();
  };

  const pendingRegistrations = tools.map(async (tool) => {
    try {
      await modelContext.registerTool(tool, {
        signal: controller.signal,
      });
      if (!controller.signal.aborted) {
        registeredNames.add(tool.name);
      }
    } catch (error) {
      throw new Error(
        `Failed to register ${tool.name}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      );
    }
  });

  const allRegistrations = Promise.all(pendingRegistrations).then(
    (): RegistrationOutcome => {
      if (disposed) {
        return { names: [], errors: [], cancelled: true };
      }
      return {
        names: tools
          .map((tool) => tool.name)
          .filter((name) => registeredNames.has(name)),
        errors: [],
        cancelled: false,
      };
    },
    (error): RegistrationOutcome => {
      if (disposed) {
        return { names: [], errors: [], cancelled: true };
      }
      cleanupRegistrations();
      return {
        names: [],
        errors: [error instanceof Error ? error.message : String(error)],
        cancelled: false,
      };
    },
  );

  const ready = Promise.race([cancellation, allRegistrations]);

  return {
    ready,
    dispose() {
      if (disposed) return;
      disposed = true;
      cleanupRegistrations();
      resolveCancellation({
        names: [],
        errors: [],
        cancelled: true,
      });
    },
  };
}
