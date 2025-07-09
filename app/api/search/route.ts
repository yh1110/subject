import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // 一旦検索ワード設定なしの場合はエラーとして返却
  // 出来れば全体検索(スター数上位とか)で表示
  if (!q) {
    return NextResponse.json(
      { message: "検索ワードが設定されていません" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q
    )}&per_page=20&page=1`,
    {
      headers,
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return NextResponse.json(await res.json(), { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
