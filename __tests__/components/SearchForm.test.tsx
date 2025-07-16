import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm, SearchFormData } from "@/components/SearchForm";
import type { ComponentProps } from "react";

// 型定義
type ButtonProps = ComponentProps<"button"> & {
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "data-testid"?: string;
};

type InputProps = ComponentProps<"input"> & {
  name?: string;
  placeholder?: string;
  "data-testid"?: string;
};

type TextProps = {
  children: React.ReactNode;
  "data-testid"?: string;
};

type ContainerProps = {
  children: React.ReactNode;
  centerContent?: boolean;
  py?: number;
};

type CardProps = {
  children: React.ReactNode;
  maxW?: string;
  shadow?: string;
  size?: Record<string, string>;
  w?: string;
};

type CardBodyProps = {
  children: React.ReactNode;
  p?: string;
};

type HStackProps = {
  children: React.ReactNode;
  gap?: string;
};

type InputGroupProps = {
  children: React.ReactNode;
  flex?: string;
};

type InputLeftElementProps = {
  children: React.ReactNode;
};

// Yamada UIのモック（適切な型定義付き）
vi.mock("@yamada-ui/react", () => ({
  Button: ({
    children,
    disabled,
    type,
    "data-testid": testId,
    ...props
  }: ButtonProps) => (
    <button disabled={disabled} type={type} data-testid={testId} {...props}>
      {children}
    </button>
  ),
  Card: ({ children }: CardProps) => <div>{children}</div>,
  CardBody: ({ children }: CardBodyProps) => <div>{children}</div>,
  Container: ({ children }: ContainerProps) => <div>{children}</div>,
  HStack: ({ children }: HStackProps) => <div>{children}</div>,
  Input: ({
    name,
    placeholder,
    "data-testid": testId,
    ...props
  }: InputProps) => (
    <input
      name={name}
      placeholder={placeholder}
      data-testid={testId}
      {...props}
    />
  ),
  InputGroup: ({ children }: InputGroupProps) => <div>{children}</div>,
  InputLeftElement: ({ children }: InputLeftElementProps) => (
    <div>{children}</div>
  ),
  Text: ({ children, "data-testid": testId }: TextProps) => (
    <span data-testid={testId}>{children}</span>
  ),
}));

// Yamada UI Lucideのモック
vi.mock("@yamada-ui/lucide", () => ({
  SearchIcon: ({ fontSize }: { fontSize?: number }) => (
    <svg data-testid="search-icon" fontSize={fontSize}>
      <path d="search" />
    </svg>
  ),
}));

describe("SearchForm", () => {
  const mockOnSubmit = vi.fn<(data: SearchFormData) => void>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常にレンダリングされる", () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("プレースホルダーが正しく表示される", () => {
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input");
    expect(input).toHaveAttribute(
      "placeholder",
      "キーワードを入力してください"
    );
  });

  it("ローディング状態でボタンが無効化される", () => {
    render(<SearchForm onSubmit={mockOnSubmit} loading={true} />);

    const button = screen.getByTestId("search-button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("検索中...");
  });

  it("通常状態でボタンが有効化される", () => {
    render(<SearchForm onSubmit={mockOnSubmit} loading={false} />);

    const button = screen.getByTestId("search-button");
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("検索");
  });

  it("有効な入力でフォーム送信が動作する", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    await user.type(input, "react");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "react" }),
        expect.any(Object)
      );
    });
  });

  it("空の入力でバリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const button = screen.getByTestId("search-button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("validation-error")).toBeInTheDocument();
      expect(screen.getByTestId("validation-error")).toHaveTextContent(
        "キーワードは必須です"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("空白のみの入力でバリデーションエラーが表示される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    await user.type(input, "   ");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("validation-error")).toBeInTheDocument();
      expect(screen.getByTestId("validation-error")).toHaveTextContent(
        "キーワードは必須です"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("前後の空白がある有効な入力で送信される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    await user.type(input, "  react  ");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "  react  " }),
        expect.any(Object)
      );
    });
  });

  it("Enterキーでフォーム送信が動作する", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;

    await user.type(input, "vue");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "vue" }),
        expect.any(Object)
      );
    });
  });

  it("フォーム送信後にバリデーションエラーがクリアされる", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    // 最初に空で送信してエラーを表示
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    });

    // 有効な値を入力して送信
    await user.type(input, "angular");
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByTestId("validation-error")).not.toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "angular" }),
        expect.any(Object)
      );
    });
  });

  it("特殊文字を含む検索キーワードが正しく処理される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    const specialKeyword = "test-project @typescript #react";
    await user.type(input, specialKeyword);
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: specialKeyword }),
        expect.any(Object)
      );
    });
  });

  it("長いキーワードが正しく処理される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    const longKeyword = "a".repeat(50); // テスト速度のため短縮
    await user.type(input, longKeyword);
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: longKeyword }),
        expect.any(Object)
      );
    });
  });

  it("複数回の送信が正しく処理される", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    const button = screen.getByTestId("search-button");

    // 1回目の送信
    await user.type(input, "react");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "react" }),
        expect.any(Object)
      );
    });

    // 2回目の送信
    await user.clear(input);
    await user.type(input, "vue");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ q: "vue" }),
        expect.any(Object)
      );
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
  });
});
