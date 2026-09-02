import { describe, expect, it } from "vitest";
import {
  AFFECTED_LOT,
  CONFUSABLE_LOT,
  RECALL_ID,
  RecallWorkbench,
  generateOrders,
} from "./domain";

describe("deterministic recall domain", () => {
  it("generates the exact challenge ground truth", () => {
    const orders = generateOrders();
    expect(orders).toHaveLength(8420);
    expect(orders.filter((order) => order.lot === AFFECTED_LOT)).toHaveLength(37);
    expect(orders.filter((order) => order.lot === CONFUSABLE_LOT)).toHaveLength(213);
    expect(new Set(orders.slice(0, 37).map((order) => order.state))).toEqual(
      new Set(["warehouse", "in-transit", "delivered", "already-returned"]),
    );
  });

  it("strictly excludes the confusable lot", () => {
    const service = new RecallWorkbench();
    expect(() => service.traceAffectedStock(RECALL_ID, CONFUSABLE_LOT)).toThrow(
      /not the affected lot/,
    );
    const result = service.traceAffectedStock(RECALL_ID, AFFECTED_LOT);
    expect(result).toMatchObject({ scanned: 8420, exactMatches: 37, explicitlyExcluded: 213 });
  });

  it("never makes a durable mutation before visible review confirmation", () => {
    const service = new RecallWorkbench();
    service.traceAffectedStock(RECALL_ID, AFFECTED_LOT);
    service.findImpactedFulfillments(RECALL_ID, AFFECTED_LOT);
    service.classifyRecallActions(RECALL_ID, AFFECTED_LOT);
    service.previewRecallScope(RECALL_ID, AFFECTED_LOT);
    service.stageInventoryQuarantine(RECALL_ID, AFFECTED_LOT);
    const stagedResponse = service.stageCustomerAndCarrierResponse(
      RECALL_ID,
      AFFECTED_LOT,
      "precautionary-recall-v1",
    );
    expect(stagedResponse).toMatchObject({
      carrierInterceptRequests: 9,
      customerOutreachDrafts: 18,
      released: false,
    });
    expect(service.getSnapshot()).toMatchObject({
      quarantineStatus: "staged",
      carrierInterceptStatus: "staged",
      customerOutreachStatus: "staged",
      durableCommitCount: 0,
    });
    expect(service.getReceipt(RECALL_ID)).toMatchObject({ status: "not-confirmed" });

    const receipt = service.confirmFromVisibleControl("Test recall lead");
    expect(service.getSnapshot().durableCommitCount).toBe(1);
    expect(receipt).toMatchObject({
      affectedLot: AFFECTED_LOT,
      impactedOrders: 37,
      excludedLookalikes: 213,
      confirmationSource: "Test recall lead",
      quarantineOrders: 10,
      carrierInterceptRequests: 9,
      customerOutreachDrafts: 18,
      demoChecksum: "demo-8420-37-213-10-9-18",
    });
    expect(service.getSnapshot()).toMatchObject({
      stage: "confirmed",
      quarantineStatus: "committed",
      carrierInterceptStatus: "released",
      customerOutreachStatus: "released",
      durableCommitCount: 1,
    });
  });

  it("clears staged drafts without committing", () => {
    const service = new RecallWorkbench();
    service.traceAffectedStock(RECALL_ID, AFFECTED_LOT);
    service.findImpactedFulfillments(RECALL_ID, AFFECTED_LOT);
    service.classifyRecallActions(RECALL_ID, AFFECTED_LOT);
    service.previewRecallScope(RECALL_ID, AFFECTED_LOT);
    service.stageInventoryQuarantine(RECALL_ID, AFFECTED_LOT);
    expect(service.cancelStagedRecall(RECALL_ID)).toEqual({
      cancelled: true,
      committedChanges: 0,
    });
    expect(service.getSnapshot()).toMatchObject({
      stage: "previewed",
      quarantineStatus: "waiting",
      carrierInterceptStatus: "waiting",
      customerOutreachStatus: "waiting",
      durableCommitCount: 0,
    });
  });

  it("clears the ephemeral confirmed receipt when a new rehearsal starts", () => {
    const service = new RecallWorkbench();
    service.traceAffectedStock(RECALL_ID, AFFECTED_LOT);
    service.findImpactedFulfillments(RECALL_ID, AFFECTED_LOT);
    service.classifyRecallActions(RECALL_ID, AFFECTED_LOT);
    service.previewRecallScope(RECALL_ID, AFFECTED_LOT);
    service.stageInventoryQuarantine(RECALL_ID, AFFECTED_LOT);
    service.stageCustomerAndCarrierResponse(
      RECALL_ID,
      AFFECTED_LOT,
      "precautionary-recall-v1",
    );
    service.confirmFromVisibleControl();
    expect(service.getReceipt(RECALL_ID)).toMatchObject({
      status: "confirmed",
      receipt: { demoChecksum: "demo-8420-37-213-10-9-18" },
    });

    service.reset();

    expect(service.getSnapshot()).toMatchObject({
      stage: "case-ready",
      quarantineStatus: "waiting",
      carrierInterceptStatus: "waiting",
      customerOutreachStatus: "waiting",
      durableCommitCount: 0,
      receipt: null,
    });
    expect(service.getReceipt(RECALL_ID)).toMatchObject({
      status: "not-confirmed",
    });
  });
});
