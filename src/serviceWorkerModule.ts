export function goToProtocolTab(event: any, prtId: number) {
  const worker =
    "serviceWorker" in navigator ? navigator.serviceWorker.controller : null;

  if (worker != null) {
    worker.postMessage({ type: "FOCUS_TO_PROTOCOL", prtId });
  }
}
export function alertProtocolTab(event: any, prtId: number) {
  const worker =
    "serviceWorker" in navigator ? navigator.serviceWorker.controller : null;

  if (worker != null) {
    worker.postMessage({ type: "AlERT_TO_PROTOCOL", prtId });
  }
}
