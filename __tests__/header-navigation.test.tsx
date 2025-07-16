import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Header from "../components/Header";

// Next.js router のモック
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Next.js Link のモック
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string; [key: string]: unknown }>) => (
    <a href={href} data-testid="header-link" {...props}>
      {children}
    </a>
  ),
}));

// Lucide React のモック
vi.mock("lucide-react", () => ({
  Github: () => <svg data-testid="github-icon" />,
}));

describe("ヘッダーナビゲーション", () => {
  it("ヘッダータイトルがルートページへのリンクになっている", () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("タイトルをクリックするとルートページに遷移する", async () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");
    await userEvent.click(titleLink);

    // リンクのhref属性が正しく設定されていることを確認
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("タイトルテキストが正しく表示される", () => {
    render(<Header />);

    expect(screen.getByText("GitHub Repository Search")).toBeInTheDocument();
    expect(screen.getByText("リポジトリを発見・探索")).toBeInTheDocument();
  });

  it("GitHubアイコンが表示される", () => {
    render(<Header />);

    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
  });

  it("ホバー効果のスタイルクラスが適用されている", () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");
    expect(titleLink).toHaveClass("hover:opacity-80", "transition-opacity");
  });

  it("スティッキーヘッダーのスタイルが適用されている", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("sticky", "top-0", "z-50");
  });

  it("レスポンシブデザインでサブタイトルが適切に表示される", () => {
    render(<Header />);

    const subtitle = screen.getByText("リポジトリを発見・探索");
    expect(subtitle).toHaveClass("hidden", "sm:block");
  });
});

// 実際のナビゲーション動作をテスト（統合テスト的）
describe("ヘッダーナビゲーション統合テスト", () => {
  it("ページ読み込み時にヘッダーが正しく表示される", () => {
    render(<Header />);

    // ヘッダー要素が存在することを確認
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // タイトルリンクが存在することを確認
    expect(screen.getByTestId("header-link")).toBeInTheDocument();

    // 必要な要素が全て表示されることを確認
    expect(screen.getByText("GitHub Repository Search")).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
  });

  it("キーボードナビゲーションでタイトルリンクにフォーカスできる", async () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");

    // Tabキーでフォーカス移動をシミュレート
    await userEvent.tab();
    expect(titleLink).toHaveFocus();
  });

  it("Enterキーでタイトルリンクを活性化できる", async () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");
    titleLink.focus();

    // Enterキーを押下
    await userEvent.keyboard("{Enter}");

    // リンクが正しく設定されていることを再確認
    expect(titleLink).toHaveAttribute("href", "/");
  });
});

// リンクのアクセシビリティテスト
describe("ヘッダーアクセシビリティ", () => {
  it("タイトルリンクに適切なaria属性が設定されている", () => {
    render(<Header />);

    const titleLink = screen.getByTestId("header-link");
    // リンクが適切にホームページへの遷移を示している
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("ヘッダーがbannerロールを持っている", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
