"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function RepoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNotFound = error.message.toLowerCase().includes("not found");
  const isRateLimit = error.message.toLowerCase().includes("rate limit");
  const isUnauthorized = error.message.toLowerCase().includes("unauthorized");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <AlertOctagon className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isNotFound
              ? "リポジトリが見つかりません"
              : isRateLimit
              ? "API制限に達しました"
              : isUnauthorized
              ? "アクセスが拒否されました"
              : "リポジトリの取得に失敗しました"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {isNotFound
              ? "指定されたリポジトリは存在しないか、プライベートリポジトリの可能性があります。"
              : isRateLimit
              ? "GitHub APIのレート制限に達しました。しばらく待ってから再度お試しください。"
              : isUnauthorized
              ? "このリポジトリへのアクセス権限がありません。"
              : "リポジトリ情報の取得中にエラーが発生しました。"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {!isNotFound && (
              <Button
                onClick={() => reset()}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再試行
              </Button>
            )}
            <Button
              asChild
              variant={isNotFound ? "default" : "outline"}
              className="flex-1"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                ホームに戻る
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
