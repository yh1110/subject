import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchForm } from "@/components/SearchForm";

// より現実的なテストのために、重要な部分のみテスト
describe("SearchForm - ユニットテスト", () => {
  it("コンポーネントが正常にレンダリングされる", () => {
    const mockOnSubmit = () => {};
    render(<SearchForm onSubmit={mockOnSubmit} />);
    
    // 検索入力フィールドが存在することを確認
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    
    // 検索ボタンが存在することを確認
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    
    // プレースホルダーが正しく設定されていることを確認
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "placeholder",
      "キーワードを入力してください"
    );
  });

  it("ローディング状態が正しく表示される", () => {
    const mockOnSubmit = () => {};
    render(<SearchForm onSubmit={mockOnSubmit} loading={true} />);
    
    const button = screen.getByTestId("search-button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("検索中...");
  });

  it("通常状態では検索ボタンが有効", () => {
    const mockOnSubmit = () => {};
    render(<SearchForm onSubmit={mockOnSubmit} loading={false} />);
    
    const button = screen.getByTestId("search-button");
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("検索");
  });
});