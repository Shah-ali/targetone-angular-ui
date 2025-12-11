// src/app/services/url-sanitizer.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UrlSanitizerService {
  sanitize(url: string): string {
    if (!url) return url;

    // Decode common HTML encodings (&amp;)
    url = url.replace(/&amp;/g, "&");

    // Replace multiple ? with a single ?
    url = url.replace(/\?{2,}/g, "?");

    // Replace multiple & with a single &
    url = url.replace(/&{2,}/g, "&");

    // Remove ?& (case: ?&rr=1)
    url = url.replace(/\?&/g, "?");

    // Remove trailing ? or &
    url = url.replace(/[&?]+$/g, "");

    // If URL has & but no ?, replace first & with ?
    if (url.includes("&") && !url.includes("?")) {
      url = url.replace("&", "?");
    }

    return url;
  }
}
