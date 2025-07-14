import { describe, it, expect } from "vitest";
import { formatNumber, formatDate, formatSize } from "../lib/formatters";

describe("Formatters", () => {
  describe("formatNumber", () => {
    it("1000未満の数値はそのまま文字列で返す", () => {
      expect(formatNumber(999)).toBe("999");
      expect(formatNumber(100)).toBe("100");
      expect(formatNumber(0)).toBe("0");
    });

    it("1000以上の数値はk形式で返す", () => {
      expect(formatNumber(1000)).toBe("1.0k");
      expect(formatNumber(1500)).toBe("1.5k");
      expect(formatNumber(10000)).toBe("10.0k");
    });
  });

  describe("formatDate", () => {
    it("ISO日付文字列を日本語形式に変換する", () => {
      const result = formatDate("2023-12-01T00:00:00Z");
      expect(result).toMatch(/2023年.*12月.*1日/);
    });

    it("異なる日付でも正しく変換する", () => {
      const result = formatDate("2023-01-15T12:30:00Z");
      expect(result).toMatch(/2023年.*1月.*15日/);
    });
  });

  describe("formatSize", () => {
    it("1024未満の値はKB単位で返す", () => {
      expect(formatSize(512)).toBe("512 KB");
      expect(formatSize(1000)).toBe("1000 KB");
    });

    it("1024以上の値はMB単位で返す", () => {
      expect(formatSize(1024)).toBe("1.0 MB");
      expect(formatSize(2048)).toBe("2.0 MB");
      expect(formatSize(1536)).toBe("1.5 MB");
    });
  });
});