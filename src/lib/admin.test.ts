import { describe, expect, it } from "vitest";
import {
  ADMIN_COOKIE,
  adminSessionToken,
  isAdminCookie,
  isAdminRequest,
  readCookieValue,
  safeEqualPin,
} from "./admin";

describe("admin session", () => {
  it("does not treat cookie=1 as unlocked", () => {
    expect(isAdminCookie("1")).toBe(false);
    const req = new Request("http://localhost/api/x", {
      headers: { cookie: `${ADMIN_COOKIE}=1` },
    });
    expect(isAdminRequest(req)).toBe(false);
  });

  it("accepts only the HMAC token for the configured PIN", () => {
    const prev = process.env.ADMIN_PIN;
    process.env.ADMIN_PIN = "test-pin-launch-ready";
    try {
      const token = adminSessionToken();
      expect(token).toBeTruthy();
      expect(isAdminCookie(token)).toBe(true);
      expect(isAdminCookie(`${token}x`)).toBe(false);
      expect(isAdminCookie("1")).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.ADMIN_PIN;
      else process.env.ADMIN_PIN = prev;
    }
  });

  it("parses the named cookie from a header", () => {
    expect(readCookieValue(`a=1; ${ADMIN_COOKIE}=abc; b=2`, ADMIN_COOKIE)).toBe(
      "abc",
    );
  });

  it("compares pins in constant time", () => {
    expect(safeEqualPin("abcd", "abcd")).toBe(true);
    expect(safeEqualPin("abcd", "abce")).toBe(false);
    expect(safeEqualPin("ab", "abcd")).toBe(false);
  });
});
