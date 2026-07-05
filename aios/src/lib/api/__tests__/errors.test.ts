import { describe, it, expect } from "vitest";
import { APIError, handleAPIError } from "../errors";
import { NextResponse } from "next/server";

describe("APIError", () => {
  it("creates an error with default values", () => {
    const error = new APIError("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.name).toBe("APIError");
  });

  it("creates an error with custom status and code", () => {
    const error = new APIError("Not found", 404, "NOT_FOUND");
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("includes optional details", () => {
    const details = { field: "email" };
    const error = new APIError("Validation failed", 400, "VALIDATION_ERROR", details);
    expect(error.details).toEqual(details);
  });
});

describe("handleAPIError", () => {
  it("returns a 500 response for unknown errors", () => {
    const response = handleAPIError(new Error("Unknown"));
    expect(response.status).toBe(500);
  });

  it("returns the correct status for APIErrors", () => {
    const response = handleAPIError(new APIError("Not found", 404, "NOT_FOUND"));
    expect(response.status).toBe(404);
  });
});
