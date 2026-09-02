export const RECALL_ID = "RC-2026-014";
export const AFFECTED_LOT = "L24-091";
export const CONFUSABLE_LOT = "L24-019";
export const TOTAL_ORDERS = 8420;

export type FulfillmentState =
  | "warehouse"
  | "in-transit"
  | "delivered"
  | "already-returned";

export type WorkflowStage =
  | "case-ready"
  | "stock-traced"
  | "fulfillments-found"
  | "classified"
  | "previewed"
  | "quarantine-staged"
  | "response-staged"
  | "confirmed";

export type Order = {
  id: string;
  lot: string;
  state: FulfillmentState;
  customer: string;
  region: string;
  units: number;
};

export type ActionClass = {
  key: "quarantine" | "intercept" | "contact" | "closed";
  label: string;
  count: number;
  tone: string;
};

export type TimelineEntry = {
  id: number;
  title: string;
  detail: string;
  kind: "evidence" | "stage" | "approval";
  time: string;
};

export type Receipt = {
  id: string;
  confirmedAt: string;
  confirmationSource: string;
  affectedLot: string;
  impactedOrders: number;
  excludedLookalikes: number;
  quarantineOrders: number;
  carrierInterceptRequests: number;
  customerOutreachDrafts: number;
  demoChecksum: string;
};

export type WorkbenchSnapshot = {
  stage: WorkflowStage;
  orders: Order[];
  impacted: Order[];
  confusable: Order[];
  actions: ActionClass[];
  quarantineStatus: "waiting" | "staged" | "committed";
  carrierInterceptStatus: "waiting" | "staged" | "released";
  customerOutreachStatus: "waiting" | "staged" | "released";
  durableCommitCount: number;
  receipt: Receipt | null;
  timeline: TimelineEntry[];
};

const states: FulfillmentState[] = [
  "warehouse",
  "in-transit",
  "delivered",
  "already-returned",
];
const regions = ["Northeast", "Midwest", "South", "West"];
const otherLots = ["L24-088", "L24-094", "L24-102", "L25-006", "L25-011"];

export function generateOrders(): Order[] {
  return Array.from({ length: TOTAL_ORDERS }, (_, index) => {
    const number = index + 1;
    const lot =
      index < 37
        ? AFFECTED_LOT
        : index < 250
          ? CONFUSABLE_LOT
          : otherLots[index % otherLots.length];
    return {
      id: `ORD-${String(number).padStart(5, "0")}`,
      lot,
      state: states[index % states.length],
      customer: `Customer ${String(((index * 47) % 997) + 1).padStart(3, "0")}`,
      region: regions[(index * 3) % regions.length],
      units: 1,
    };
  });
}

function assertActiveCase(recallId: unknown, lot: unknown) {
  if (recallId !== RECALL_ID) {
    throw new Error(`Unknown recall case. Use recallId "${RECALL_ID}".`);
  }
  if (lot !== AFFECTED_LOT) {
    throw new Error(
      `Lot "${String(lot)}" is not the affected lot. Use exact lot "${AFFECTED_LOT}" and never substitute lookalike "${CONFUSABLE_LOT}".`,
    );
  }
}

function assertStage(stage: WorkflowStage, allowed: WorkflowStage[], action: string) {
  if (!allowed.includes(stage)) {
    throw new Error(
      `${action} is not available at stage "${stage}". Complete the preceding recall step first.`,
    );
  }
}

export class RecallWorkbench {
  private state: WorkbenchSnapshot;
  private listeners = new Set<() => void>();
  private nextTimelineId = 2;

  constructor() {
    const orders = generateOrders();
    this.state = {
      stage: "case-ready",
      orders,
      impacted: [],
      confusable: [],
      actions: [],
      quarantineStatus: "waiting",
      carrierInterceptStatus: "waiting",
      customerOutreachStatus: "waiting",
      durableCommitCount: 0,
      receipt: null,
      timeline: [
        {
          id: 1,
          title: "Recall case selected",
          detail: `${RECALL_ID} · exact supplier lot ${AFFECTED_LOT}`,
          kind: "evidence",
          time: "09:12",
        },
      ],
    };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.state;

  private update(patch: Partial<WorkbenchSnapshot>, entry?: Omit<TimelineEntry, "id">) {
    this.state = {
      ...this.state,
      ...patch,
      timeline: entry
        ? [...this.state.timeline, { ...entry, id: this.nextTimelineId++ }]
        : this.state.timeline,
    };
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    const fresh = new RecallWorkbench();
    this.nextTimelineId = 2;
    this.state = fresh.getSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  getRecallCase(recallId: unknown = RECALL_ID) {
    if (recallId !== RECALL_ID) {
      throw new Error(`Unknown recall case. Use recallId "${RECALL_ID}".`);
    }
    return {
      recallId: RECALL_ID,
      product: "Solace Mini Kettle · 1.2L",
      affectedLot: AFFECTED_LOT,
      confusableLot: CONFUSABLE_LOT,
      reason: "Supplier thermal-cutoff variance",
      severity: "Class II · precautionary",
      candidateOrders: TOTAL_ORDERS,
      finalAction: "Visible review confirmation required",
    };
  }

  traceAffectedStock(recallId: unknown, lot: unknown) {
    assertActiveCase(recallId, lot);
    assertStage(this.state.stage, ["case-ready"], "Stock tracing");
    const impacted = this.state.orders.filter((order) => order.lot === AFFECTED_LOT);
    const confusable = this.state.orders.filter((order) => order.lot === CONFUSABLE_LOT);
    this.update(
      { stage: "stock-traced", impacted, confusable },
      {
        title: "Exact-lot trace complete",
        detail: `${TOTAL_ORDERS.toLocaleString()} scanned · ${impacted.length} matched · ${confusable.length} lookalikes excluded`,
        kind: "evidence",
        time: "09:13",
      },
    );
    return {
      scanned: this.state.orders.length,
      exactMatches: impacted.length,
      explicitlyExcluded: confusable.length,
      exclusionReason: `${CONFUSABLE_LOT} differs from ${AFFECTED_LOT}`,
    };
  }

  findImpactedFulfillments(recallId: unknown, lot: unknown) {
    assertActiveCase(recallId, lot);
    assertStage(this.state.stage, ["stock-traced"], "Fulfillment matching");
    const byState = Object.fromEntries(
      states.map((state) => [
        state,
        this.state.impacted.filter((order) => order.state === state).length,
      ]),
    );
    this.update(
      { stage: "fulfillments-found" },
      {
        title: "Fulfillments resolved",
        detail: `${this.state.impacted.length} affected orders mapped across four fulfillment states`,
        kind: "evidence",
        time: "09:14",
      },
    );
    return { total: this.state.impacted.length, byState };
  }

  classifyRecallActions(recallId: unknown, lot: unknown) {
    assertActiveCase(recallId, lot);
    assertStage(this.state.stage, ["fulfillments-found"], "Action classification");
    const count = (state: FulfillmentState) =>
      this.state.impacted.filter((order) => order.state === state).length;
    const actions: ActionClass[] = [
      { key: "quarantine", label: "Quarantine on hand", count: count("warehouse"), tone: "amber" },
      { key: "intercept", label: "Intercept in transit", count: count("in-transit"), tone: "violet" },
      { key: "contact", label: "Contact delivered", count: count("delivered"), tone: "blue" },
      { key: "closed", label: "Already returned", count: count("already-returned"), tone: "green" },
    ];
    this.update(
      { stage: "classified", actions },
      {
        title: "Actions classified",
        detail: "Each exact match assigned one mutually exclusive response",
        kind: "evidence",
        time: "09:15",
      },
    );
    return { actions, classified: actions.reduce((sum, item) => sum + item.count, 0) };
  }

  previewRecallScope(recallId: unknown, lot: unknown) {
    assertActiveCase(recallId, lot);
    assertStage(this.state.stage, ["classified"], "Scope preview");
    this.update(
      { stage: "previewed" },
      {
        title: "Scope previewed",
        detail: "Review panel opened; no operational action committed",
        kind: "stage",
        time: "09:16",
      },
    );
    return {
      candidateOrders: TOTAL_ORDERS,
      exactRecipients: this.state.impacted.length,
      excludedLookalikes: this.state.confusable.length,
      durableChanges: this.state.durableCommitCount,
    };
  }

  stageInventoryQuarantine(recallId: unknown, lot: unknown) {
    assertActiveCase(recallId, lot);
    assertStage(this.state.stage, ["previewed"], "Inventory quarantine staging");
    const quarantineOrders = this.state.impacted.filter(
      (order) => order.state === "warehouse",
    ).length;
    this.update(
      { stage: "quarantine-staged", quarantineStatus: "staged" },
      {
        title: "Quarantine staged",
        detail: `${quarantineOrders} warehouse orders prepared · not committed`,
        kind: "stage",
        time: "09:17",
      },
    );
    return { staged: true, quarantineOrders, committed: false };
  }

  stageCustomerAndCarrierResponse(
    recallId: unknown,
    lot: unknown,
    template: unknown,
  ) {
    assertActiveCase(recallId, lot);
    if (template !== "precautionary-recall-v1") {
      throw new Error('Use approved template "precautionary-recall-v1".');
    }
    assertStage(
      this.state.stage,
      ["quarantine-staged"],
      "Customer and carrier response staging",
    );
    const carrierInterceptRequests = this.state.impacted.filter(
      (order) => order.state === "in-transit",
    ).length;
    const customerOutreachDrafts = this.state.impacted.filter(
      (order) => order.state === "in-transit" || order.state === "delivered",
    ).length;
    this.update(
      {
        stage: "response-staged",
        carrierInterceptStatus: "staged",
        customerOutreachStatus: "staged",
      },
      {
        title: "Customer and carrier response staged",
        detail: `${carrierInterceptRequests} carrier intercept requests · ${customerOutreachDrafts} customer outreach drafts · nothing released`,
        kind: "stage",
        time: "09:18",
      },
    );
    return {
      staged: true,
      carrierInterceptRequests,
      customerOutreachDrafts,
      template,
      released: false,
    };
  }

  cancelStagedRecall(recallId: unknown) {
    if (recallId !== RECALL_ID) {
      throw new Error(`Unknown recall case. Use recallId "${RECALL_ID}".`);
    }
    assertStage(
      this.state.stage,
      ["quarantine-staged", "response-staged"],
      "Cancel staged recall",
    );
    this.update(
      {
        stage: "previewed",
        quarantineStatus: "waiting",
        carrierInterceptStatus: "waiting",
        customerOutreachStatus: "waiting",
      },
      {
        title: "Staged plan cleared",
        detail: "Ephemeral quarantine and outreach drafts removed",
        kind: "stage",
        time: "09:19",
      },
    );
    return { cancelled: true, committedChanges: 0 };
  }

  confirmFromVisibleControl(confirmationSource = "Visible review control") {
    assertStage(this.state.stage, ["response-staged"], "Final confirmation");
    const quarantineOrders = this.state.impacted.filter(
      (order) => order.state === "warehouse",
    ).length;
    const carrierInterceptRequests = this.state.impacted.filter(
      (order) => order.state === "in-transit",
    ).length;
    const customerOutreachDrafts = this.state.impacted.filter(
      (order) => order.state === "in-transit" || order.state === "delivered",
    ).length;
    const receipt: Receipt = {
      id: "RCP-RC2026014-091",
      confirmedAt: "2026-09-02T09:20:00+02:00",
      confirmationSource,
      affectedLot: AFFECTED_LOT,
      impactedOrders: this.state.impacted.length,
      excludedLookalikes: this.state.confusable.length,
      quarantineOrders,
      carrierInterceptRequests,
      customerOutreachDrafts,
      demoChecksum: "demo-8420-37-213-10-9-18",
    };
    this.update(
      {
        stage: "confirmed",
        quarantineStatus: "committed",
        carrierInterceptStatus: "released",
        customerOutreachStatus: "released",
        durableCommitCount: 1,
        receipt,
      },
      {
        title: "Confirmation recorded",
        detail: `${receipt.id} · quarantine committed · carrier intercepts and customer outreach released`,
        kind: "approval",
        time: "09:20",
      },
    );
    return receipt;
  }

  getReceipt(recallId: unknown) {
    if (recallId !== RECALL_ID) {
      throw new Error(`Unknown recall case. Use recallId "${RECALL_ID}".`);
    }
    if (!this.state.receipt) {
      return {
        status: "not-confirmed",
        message:
          "No receipt exists until final confirmation occurs through the visible normal page control.",
      };
    }
    return { status: "confirmed", receipt: this.state.receipt };
  }
}
