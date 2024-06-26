/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

class Logger {
  static logs: unknown[] = [];

  static pushAndLog(...logs: unknown[]) {
    Logger.pushLog(...logs);
    Logger.logInfo(...logs);
  }

  static pushLog(...logs: unknown[]) {
    Logger.logs.push(...logs);
  }

  static logInfo(...logs: unknown[]) {
    console.info(...logs);
  }

  static logError(...logs: unknown[]) {
    console.error(...logs);
  }

  static flushLogs() {
    return Logger.logs.splice(0, Logger.logs.length);
  }
}

class MessengerModule {
  private static notifyClients(message: object) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) =>
        client.postMessage(JSON.parse(JSON.stringify(message)))
      );
    });
  }
  // private static notifyTabToClients(message: object) {
  //     self.clients.matchAll().then((clients) => {
  //         clients.forEach((client) => client.postMessage(message));
  //     });
  // }

  private static notifyClientToFocus(protocolId: string) {
    self.clients.matchAll().then((clients) => {
      Logger.logInfo("found this 114 --> ", clients);
      clients.forEach((client: Client) => {
        if (client.url.includes(protocolId)) {
          Logger.logInfo("found this 117 --> ", client);
          client.postMessage({
            type: "FOCUS_TAB",
            tab: {
              frameType: client.frameType,
              id: client.id,
              type: client.type,
              url: client.url,
            },
          });
          // (client as WindowClient).focus();
        } else {
          return false;
        }
      });
    });
  }

  private static notifyClientToAlert(protocolId: string) {
    self.clients.matchAll().then((clients) => {
      Logger.logInfo("found this 137 --> ", clients);
      clients.forEach((client: Client) => {
        if (client.url.includes(protocolId)) {
          Logger.logInfo("found this 140 --> ", client);
          client.postMessage({
            type: "ALERT_TAB",
            tab: {
              frameType: client.frameType,
              id: client.id,
              type: client.type,
              url: client.url,
            },
          });
          // (client as WindowClient).focus();
        } else {
          return false;
        }
      });
    });
  }

  static onFocusTab(prtId: string) {
    this.notifyClients({ type: "BLUR_TAB" });
    setTimeout(() => this.notifyClientToFocus(prtId), 0);
  }

  static onAlertTab(prtId: string) {
    this.notifyClients({ type: "BLUR_TAB" });
    setTimeout(() => this.notifyClientToAlert(prtId), 0);
  }
}

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  const data = event.data;

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (data.type === "FOCUS_TO_PROTOCOL") {
    MessengerModule.onFocusTab(data.prtId);
    // self.skipWaiting();
  }

  if (data.type === "AlERT_TO_PROTOCOL") {
    MessengerModule.onAlertTab(data.prtId);
    // self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
