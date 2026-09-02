import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";
import {
  AFFECTED_LOT,
  CONFUSABLE_LOT,
  RECALL_ID,
  RecallWorkbench,
  type WorkflowStage,
} from "./domain";
import {
  createWebMcpTools,
  registerWebMcpTools,
  resolveModelContext,
} from "./webmcp";

const stageOrder: WorkflowStage[] = [
  "case-ready",
  "stock-traced",
  "fulfillments-found",
  "classified",
  "previewed",
  "quarantine-staged",
  "response-staged",
  "confirmed",
];

const stageLabels: Record<WorkflowStage, string> = {
  "case-ready": "Case ready",
  "stock-traced": "Stock traced",
  "fulfillments-found": "Fulfillments found",
  classified: "Actions classified",
  previewed: "Scope previewed",
  "quarantine-staged": "Quarantine staged",
  "response-staged": "Awaiting review",
  confirmed: "Confirmed",
};

const nextStepByStage: Record<WorkflowStage, string> = {
  "case-ready": "trace_affected_stock",
  "stock-traced": "find_impacted_fulfillments",
  "fulfillments-found": "classify_recall_actions",
  classified: "preview_recall_scope",
  previewed: "stage_inventory_quarantine",
  "quarantine-staged": "stage_customer_and_carrier_response",
  "response-staged": "visible review control",
  confirmed: "get_recall_receipt",
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function App() {
  const service = useMemo(() => new RecallWorkbench(), []);
  const snapshot = useSyncExternalStore(
    service.subscribe,
    service.getSnapshot,
    service.getSnapshot,
  );
  const [webMcp, setWebMcp] = useState<{
    state: "checking" | "ready" | "unavailable" | "error";
    names: string[];
    message?: string;
  }>({ state: "checking", names: [] });
  const [rehearsing, setRehearsing] = useState(false);

  const waitForUi = useCallback(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
    [],
  );

  const commitUiMutation = useCallback(<T,>(mutation: () => T) => {
    let result!: T;
    flushSync(() => {
      result = mutation();
    });
    return result;
  }, []);

  useEffect(() => {
    const context = resolveModelContext();
    if (!context) {
      setWebMcp({
        state: "unavailable",
        names: [],
        message: "Use rehearsal mode or open in a compatible WebMCP browser.",
      });
      return;
    }

    let active = true;
    const registration = registerWebMcpTools(
      context,
      createWebMcpTools(service, waitForUi, commitUiMutation),
    );
    registration.ready.then((outcome) => {
      if (!active || outcome.cancelled) return;
      if (outcome.errors.length > 0) {
        setWebMcp({
          state: "error",
          names: outcome.names,
          message: outcome.errors.join(" "),
        });
      } else {
        setWebMcp({ state: "ready", names: outcome.names });
      }
    });

    return () => {
      active = false;
      registration.dispose();
    };
  }, [commitUiMutation, service, waitForUi]);

  const advance = useCallback(() => {
    const inputs = [RECALL_ID, AFFECTED_LOT] as const;
    switch (service.getSnapshot().stage) {
      case "case-ready":
        service.traceAffectedStock(...inputs);
        break;
      case "stock-traced":
        service.findImpactedFulfillments(...inputs);
        break;
      case "fulfillments-found":
        service.classifyRecallActions(...inputs);
        break;
      case "classified":
        service.previewRecallScope(...inputs);
        break;
      case "previewed":
        service.stageInventoryQuarantine(...inputs);
        break;
      case "quarantine-staged":
        service.stageCustomerAndCarrierResponse(
          ...inputs,
          "precautionary-recall-v1",
        );
        break;
    }
  }, [service]);

  const runRehearsal = async () => {
    if (rehearsing) return;
    if (snapshot.stage === "confirmed") service.reset();
    setRehearsing(true);
    try {
      while (
        service.getSnapshot().stage !== "response-staged" &&
        service.getSnapshot().stage !== "confirmed"
      ) {
        advance();
        await sleep(520);
      }
    } finally {
      setRehearsing(false);
    }
  };

  const progress =
    (stageOrder.indexOf(snapshot.stage) / (stageOrder.length - 1)) * 100;
  const hasMatches = snapshot.impacted.length > 0;
  const carrierInterceptCount = snapshot.impacted.filter(
    (order) => order.state === "in-transit",
  ).length;
  const customerOutreachCount = snapshot.impacted.filter(
    (order) => order.state === "in-transit" || order.state === "delivered",
  ).length;
  const quarantineCount = snapshot.impacted.filter(
    (order) => order.state === "warehouse",
  ).length;
  const hasClassifications = snapshot.actions.length > 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <p>Operations safety</p>
            <h1>Recall response workbench</h1>
          </div>
        </div>
        <div
          className={`compat-pill ${webMcp.state}`}
          role="status"
          aria-live="polite"
          title={webMcp.message}
        >
          <span className="status-dot" />
          WebMCP {webMcp.state === "ready" ? "connected" : webMcp.state}
        </div>
      </header>

      <main id="main">
        <section className="hero panel">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" /> Active recall · {RECALL_ID}
            </div>
            <h2
              className={hasMatches ? "headline-reveal" : ""}
              key={hasMatches ? "trace-complete" : "trace-pending"}
              aria-live="polite"
            >
              {hasMatches
                ? "Find the right 37. Leave the other 8,383 alone."
                : "Trace the exact lot. Protect every lookalike."}
            </h2>
            <p>
              Trace one exact supplier lot across every candidate order, prepare
              a reviewable response, and keep the irreversible decision behind
              a visible confirmation gate.
            </p>
            <div className="hero-actions">
              <button
                className="primary"
                onClick={runRehearsal}
                disabled={rehearsing || snapshot.stage === "response-staged"}
              >
                <span aria-hidden="true">▶</span>
                {rehearsing ? "Rehearsing…" : "Run guided rehearsal"}
              </button>
              <span className="rehearsal-note">
                Deterministic rehearsal · same domain service · not a WebMCP substitute
              </span>
            </div>
          </div>
          <div className="case-card">
            <div className="case-card-head">
              <span>Selected case</span>
              <strong>Class II</strong>
            </div>
            <h3>Solace Mini Kettle · 1.2L</h3>
            <p>Supplier thermal-cutoff variance</p>
            <dl>
              <div>
                <dt>Affected lot</dt>
                <dd>{AFFECTED_LOT}</dd>
              </div>
              <div className="excluded">
                <dt>Lookalike</dt>
                <dd>{CONFUSABLE_LOT} ≠ match</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="metric-grid" aria-label="Recall scope">
          <article className="metric panel">
            <span>Candidate orders</span>
            <strong>8,420</strong>
            <small>Deterministic order universe</small>
          </article>
          <article className="metric panel exact" aria-live="polite">
            <span>Exact recipients</span>
            <strong className={hasMatches ? "revealed" : "pending"}>
              {hasMatches ? snapshot.impacted.length : "Pending"}
            </strong>
            <small>
              {hasMatches ? `${AFFECTED_LOT} only` : "Awaiting exact-lot trace"}
            </small>
          </article>
          <article className="metric panel excluded" aria-live="polite">
            <span>Lookalikes excluded</span>
            <strong className={hasMatches ? "revealed" : "pending"}>
              {hasMatches ? snapshot.confusable.length : "Pending"}
            </strong>
            <small>
              {hasMatches ? `${CONFUSABLE_LOT} protected` : "Awaiting exclusion proof"}
            </small>
          </article>
          <article className="metric panel safe">
            <span>Durable actions</span>
            <strong>{snapshot.durableCommitCount}</strong>
            <small>
              {snapshot.stage === "confirmed"
                ? "Review-confirmed commit"
                : "Until review confirmation"}
            </small>
          </article>
        </section>

        <section className="workflow panel">
          <div className="section-head">
            <div>
              <p className="kicker">Shared agent + human state</p>
              <h2>{stageLabels[snapshot.stage]}</h2>
            </div>
            <div className="tool-now">
              <span>Recommended next</span>
              <code>{nextStepByStage[snapshot.stage]}</code>
            </div>
          </div>
          <div className="progress-track" aria-label={`${Math.round(progress)}% complete`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <ol className="steps">
            {[
              ["Trace", "Exact-lot evidence"],
              ["Resolve", "Fulfillment states"],
              ["Classify", "Response actions"],
              ["Stage", "Reviewable drafts"],
              ["Confirm", "Visible review gate"],
            ].map(([title, detail], index) => {
              const thresholds = [1, 2, 3, 5, 7];
              const complete = stageOrder.indexOf(snapshot.stage) >= thresholds[index];
              return (
                <li className={complete ? "complete" : ""} key={title}>
                  <span className="step-number">{complete ? "✓" : index + 1}</span>
                  <div><strong>{title}</strong><small>{detail}</small></div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="content-grid">
          <section className="panel evidence">
            <div className="section-head">
              <div>
                <p className="kicker">Explainable by construction</p>
                <h2>Evidence trail</h2>
              </div>
              <span className="verified-badge">✓ exact match</span>
            </div>
            <div className="evidence-flow">
              <div>
                <span>01</span>
                <p>Supplier notice</p>
                <strong>{AFFECTED_LOT}</strong>
              </div>
              <i>→</i>
              <div>
                <span>02</span>
                <p>Order scan</p>
                <strong>8,420 records</strong>
              </div>
              <i>→</i>
              <div>
                <span>03</span>
                <p>Exact filter</p>
                <strong className={hasMatches ? "revealed" : ""}>
                  {hasMatches ? `${snapshot.impacted.length} matches` : "Pending trace"}
                </strong>
              </div>
            </div>
            <div className="exclusion-proof">
              <span aria-hidden="true">⊘</span>
              <div>
                <strong>
                  {hasMatches
                    ? `${snapshot.confusable.length} false positives prevented`
                    : "Exclusion proof pending"}
                </strong>
                <p>
                  {hasMatches
                    ? `${CONFUSABLE_LOT} is visually confusable but fails strict equality against ${AFFECTED_LOT}.`
                    : `Trace ${AFFECTED_LOT} to verify that the confusable ${CONFUSABLE_LOT} lot is excluded.`}
                </p>
              </div>
            </div>
            <div className="sample-orders">
              <div className="table-head">
                <span>Order</span><span>Lot</span><span>State</span>
              </div>
              {(hasMatches ? snapshot.impacted.slice(0, 3) : []).map((order) => (
                <div className="table-row" key={order.id}>
                  <strong>{order.id}</strong>
                  <code>{order.lot}</code>
                  <span className={`state ${order.state}`}>{order.state}</span>
                </div>
              ))}
              {!hasMatches && (
                <div className="empty-row">Trace stock to reveal verified samples.</div>
              )}
            </div>
          </section>

          <section className="panel actions-panel">
            <div className="section-head">
              <div>
                <p className="kicker">Mutually exclusive outcomes</p>
                <h2>Action classification</h2>
              </div>
              <span className="count-badge">{snapshot.actions.length ? "37 / 37" : "pending"}</span>
            </div>
            <div className="action-list">
              {(snapshot.actions.length
                ? snapshot.actions
                : [
                    { key: "quarantine", label: "Quarantine on hand", count: "—", tone: "amber" },
                    { key: "intercept", label: "Intercept in transit", count: "—", tone: "violet" },
                    { key: "contact", label: "Contact delivered", count: "—", tone: "blue" },
                    { key: "closed", label: "Already returned", count: "—", tone: "green" },
                  ]
              ).map((action) => (
                <div className={`action-row ${snapshot.actions.length ? "" : "muted"}`} key={action.key}>
                  <span className={`action-icon ${action.tone}`} aria-hidden="true">
                    {action.key === "quarantine" ? "▣" : action.key === "intercept" ? "↪" : action.key === "contact" ? "✉" : "✓"}
                  </span>
                  <div><strong>{action.label}</strong><small>Exact-lot orders only</small></div>
                  <b>{action.count}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="panel review-panel">
            <div className="section-head">
              <div>
                <p className="kicker">Visible control point</p>
                <h2>Staged review</h2>
              </div>
              <span className={`review-state ${snapshot.stage === "confirmed" ? "done" : ""}`}>
                {snapshot.stage === "confirmed" ? "Committed" : "Not committed"}
              </span>
            </div>
            <div className="stage-card">
              <div>
                <span className={snapshot.quarantineStatus !== "waiting" ? "checked" : ""}>
                  {snapshot.quarantineStatus !== "waiting" ? "✓" : "1"}
                </span>
                <div>
                  <strong>Inventory quarantine</strong>
                  <small aria-live="polite">
                    {hasClassifications
                      ? `${quarantineCount} warehouse orders`
                      : "Inventory scope pending"}
                  </small>
                </div>
              </div>
              <b>
                {snapshot.quarantineStatus === "committed"
                  ? "Committed"
                  : snapshot.quarantineStatus === "staged"
                    ? "Staged"
                    : "Waiting"}
              </b>
            </div>
            <div className="stage-card">
              <div>
                <span className={snapshot.carrierInterceptStatus !== "waiting" ? "checked" : ""}>
                  {snapshot.carrierInterceptStatus !== "waiting" ? "✓" : "2"}
                </span>
                <div>
                  <strong>Carrier intercept requests</strong>
                  <small aria-live="polite">
                    {hasClassifications
                      ? `${carrierInterceptCount} in-transit orders`
                      : "Carrier scope pending"}
                  </small>
                </div>
              </div>
              <b>
                {snapshot.carrierInterceptStatus === "released"
                  ? "Released"
                  : snapshot.carrierInterceptStatus === "staged"
                    ? "Staged"
                    : "Waiting"}
              </b>
            </div>
            <div className="stage-card">
              <div>
                <span className={snapshot.customerOutreachStatus !== "waiting" ? "checked" : ""}>
                  {snapshot.customerOutreachStatus !== "waiting" ? "✓" : "3"}
                </span>
                <div>
                  <strong>Customer outreach drafts</strong>
                  <small aria-live="polite">
                    {hasClassifications
                      ? `${customerOutreachCount} in-transit + delivered orders`
                      : "Customer scope pending"}
                  </small>
                </div>
              </div>
              <b>
                {snapshot.customerOutreachStatus === "released"
                  ? "Released"
                  : snapshot.customerOutreachStatus === "staged"
                    ? "Staged"
                    : "Waiting"}
              </b>
            </div>
            {snapshot.stage === "confirmed" && snapshot.receipt ? (
              <div className="receipt" role="status">
                <span>✓</span>
                <div>
                  <strong>Review-confirmed receipt</strong>
                  <code>{snapshot.receipt.id}</code>
                  <small>{snapshot.receipt.demoChecksum}</small>
                </div>
              </div>
            ) : (
              <>
                <button
                  className="confirm-button"
                  disabled={snapshot.stage !== "response-staged"}
                  onClick={() => service.confirmFromVisibleControl()}
                >
                  Confirm quarantine &amp; release response
                </button>
                <p className="guardrail">
                  <span>◆</span> No consequential WebMCP tool is exposed. This
                  visible normal page control performs the final commit.
                  Ordinary browser or Codex actuation may reach it; host and
                  browser safety policies apply independently.
                </p>
              </>
            )}
          </section>

          <section className="panel timeline-panel">
            <div className="section-head">
              <div>
                <p className="kicker">Visible shared history</p>
                <h2>Activity timeline</h2>
              </div>
              <span className="count-badge">{snapshot.timeline.length} events</span>
            </div>
            <ol className="timeline">
              {snapshot.timeline.slice().reverse().map((entry) => (
                <li key={entry.id} className={entry.kind}>
                  <span className="timeline-marker" />
                  <div><strong>{entry.title}</strong><p>{entry.detail}</p></div>
                  <time>{entry.time}</time>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <footer>
        <span>Recall Response Workbench · deterministic challenge demo</span>
        <span>No credentials · no external APIs · no customer data</span>
      </footer>
    </div>
  );
}
