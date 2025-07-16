import { describe, it, expect, vi, beforeEach } from "vitest";

// グローバルfetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

// API検索のヘルパー関数
const searchRepositories = async (query: string, page: number = 1) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
};

// GitHub APIのモックレスポンス
const mockGitHubResponse = {
  total_count: 2,
  items: [
    {
      id: 1,
      name: "test-repo",
      full_name: "user/test-repo",
      description: "A test repository",
      stargazers_count: 100,
      forks_count: 50,
      watchers_count: 25,
      language: "TypeScript",
      updated_at: "2024-01-01T00:00:00Z",
      owner: {
        login: "user",
        avatar_url: "https://github.com/user.png",
      },
    },
    {
      id: 2,
      name: "another-repo",
      full_name: "user/another-repo",
      description: null,
      stargazers_count: 200,
      forks_count: 75,
      watchers_count: 40,
      language: "JavaScript",
      updated_at: "2024-01-02T00:00:00Z",
      owner: {
        login: "user",
        avatar_url: "https://github.com/user.png",
      },
    },
  ],
};

describe("API Search Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("検索API - 正常系", () => {
    it("有効なクエリで検索結果が返される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubResponse,
      });

      const result = await searchRepositories("react");

      expect(mockFetch).toHaveBeenCalledWith("/api/search?q=react&page=1");
      expect(result).toEqual(mockGitHubResponse);
      expect(result.items).toHaveLength(2);
      expect(result.total_count).toBe(2);
    });

    it("空のクエリでも適切に処理される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_count: 0, items: [] }),
      });

      const result = await searchRepositories("");

      expect(mockFetch).toHaveBeenCalledWith("/api/search?q=&page=1");
      expect(result.items).toHaveLength(0);
      expect(result.total_count).toBe(0);
    });

    it("特殊文字を含むクエリが正しくエンコードされる", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubResponse,
      });

      const specialQuery = "test @typescript #react";
      await searchRepositories(specialQuery);

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/search?q=${encodeURIComponent(specialQuery)}&page=1`
      );
    });

    it("ページネーションが正しく機能する", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubResponse,
      });

      await searchRepositories("react", 2);

      expect(mockFetch).toHaveBeenCalledWith("/api/search?q=react&page=2");
    });

    it("日本語のクエリが正しく処理される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubResponse,
      });

      const japaneseQuery = "リアクト";
      await searchRepositories(japaneseQuery);

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/search?q=${encodeURIComponent(japaneseQuery)}&page=1`
      );
    });
  });

  describe("検索API - エラー系", () => {
    it("ネットワークエラーで適切にエラーがスローされる", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(searchRepositories("react")).rejects.toThrow(
        "Network error"
      );
    });

    it("APIエラーレスポンスが適切に処理される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error" }),
      });

      const result = await searchRepositories("react");
      expect(result).toEqual({ error: "Internal Server Error" });
    });

    it("レート制限エラーが適切に処理される", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({
          message: "API rate limit exceeded",
          documentation_url:
            "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
        }),
      });

      const result = await searchRepositories("react");
      expect(result.message).toBe("API rate limit exceeded");
    });

    it("無効なJSONレスポンスでエラーが発生する", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(searchRepositories("react")).rejects.toThrow("Invalid JSON");
    });
  });

  describe("検索API - エッジケース", () => {
    it("大量の検索結果が返される場合", async () => {
      const largeResponse = {
        total_count: 100000,
        items: Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          name: `repo-${i + 1}`,
          full_name: `user/repo-${i + 1}`,
          description: `Repository ${i + 1}`,
          stargazers_count: Math.floor(Math.random() * 1000),
          forks_count: Math.floor(Math.random() * 500),
          watchers_count: Math.floor(Math.random() * 200),
          language: ["TypeScript", "JavaScript", "Python"][i % 3],
          updated_at: "2024-01-01T00:00:00Z",
          owner: {
            login: "user",
            avatar_url: "https://github.com/user.png",
          },
        })),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => largeResponse,
      });

      const result = await searchRepositories("popular");

      expect(result.items).toHaveLength(30);
      expect(result.total_count).toBe(100000);
    });

    it("検索結果が0件の場合", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_count: 0, items: [] }),
      });

      const result = await searchRepositories("nonexistent-repo-12345");

      expect(result.items).toHaveLength(0);
      expect(result.total_count).toBe(0);
    });

    it("長いクエリが正しく処理される", async () => {
      const longQuery = "a".repeat(1000);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ total_count: 0, items: [] }),
      });

      await searchRepositories(longQuery);

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/search?q=${encodeURIComponent(longQuery)}&page=1`
      );
    });
  });

  describe("検索API - パフォーマンス", () => {
    it("同時に複数のリクエストが処理される", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockGitHubResponse,
      });

      const queries = ["react", "vue", "angular"];
      const promises = queries.map((query) => searchRepositories(query));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("タイムアウトが適切に処理される", async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 100)
          )
      );

      await expect(searchRepositories("react")).rejects.toThrow(
        "Request timeout"
      );
    });
  });
});
