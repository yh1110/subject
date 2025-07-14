import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { vi } from "vitest";

// カスタムレンダー関数（必要に応じてプロバイダーでラップ）
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { ...options });

export * from "@testing-library/react";
export { customRender as render };

// テストユーティリティ関数
export const createMockRepo = (overrides = {}) => ({
  id: 1,
  name: "test-repo",
  full_name: "test-owner/test-repo",
  description: "Test repository",
  private: false,
  html_url: "https://github.com/test-owner/test-repo",
  homepage: null,
  language: "JavaScript",
  stargazers_count: 100,
  watchers_count: 50,
  forks_count: 25,
  open_issues_count: 5,
  topics: [],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-12-01T00:00:00Z",
  pushed_at: "2023-12-01T00:00:00Z",
  size: 1024,
  default_branch: "main",
  license: null,
  owner: {
    login: "test-owner",
    avatar_url: "https://github.com/avatar.jpg",
    html_url: "https://github.com/test-owner",
  },
  ...overrides,
});

export const createMockSearchResponse = (repos = [createMockRepo()]) => ({
  items: repos,
  total_count: repos.length,
});

export const mockFetch = (response: any, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => response,
  });
};

export const mockFetchError = (error = new Error("Network Error")) => {
  global.fetch = vi.fn().mockRejectedValue(error);
};

// App Router用のパラメータモック
export const createMockParams = (params: Record<string, string>) => {
  return Promise.resolve(params);
};

// Metadata生成のテスト用ヘルパー
export const createMockMetadata = (overrides = {}) => ({
  title: "Test Title",
  description: "Test Description",
  keywords: ["test", "repository"],
  ...overrides,
});
