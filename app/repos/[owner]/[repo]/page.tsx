import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Globe,
  Lock,
  Code2,
  GitBranch,
  Book,
  Clock,
  Calendar,
  GitPullRequest,
  Users,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatNumber, formatSize } from "@/lib/formatters";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

interface RepoData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export default async function RepoDetail({ params }: Props) {
  const { owner, repo } = await params;
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Repository not found");
  const data: RepoData = await res.json();


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* トップ */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={data.owner.avatar_url}
                      alt={data.owner.login}
                    />
                    <AvatarFallback>{data.owner.login[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold">{data.name}</h1>
                      {data.private && (
                        <Badge variant="secondary" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Private
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {data.owner.login} / {data.name}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <a
                    href={data.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
              {data.description && (
                <p className="text-muted-foreground text-lg max-w-4xl">
                  {data.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                {data.homepage && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={data.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {data.homepage}
                    </a>
                  </div>
                )}
                {data.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  Stars
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatNumber(data.stargazers_count)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  Forks
                </CardTitle>
                <GitFork className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatNumber(data.forks_count)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  Watchers
                </CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatNumber(data.watchers_count)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  Issues
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatNumber(data.open_issues_count)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 詳細情報 */}
        <Card>
          <CardHeader>
            <CardTitle>リポジトリ詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="details">詳細</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Language
                      </span>
                    </div>
                    <Badge>{data.language || "Not specified"}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Default Branch
                      </span>
                    </div>
                    <span className="font-medium">{data.default_branch}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        License
                      </span>
                    </div>
                    <span className="font-medium">
                      {data.license?.name || "No license"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Repository Size
                      </span>
                    </div>
                    <span className="font-medium">{formatSize(data.size)}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatDate(data.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Last Updated
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatDate(data.updated_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Last Push
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatDate(data.pushed_at)}
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>
              このリポジトリについてさらに詳しく
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild className="flex-1">
                <a
                  href={`${data.html_url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Issues を確認する
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a
                  href={`${data.html_url}/pulls`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Pull Requests を確認する
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a
                  href={`${data.html_url}/graphs/contributors`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Contributors を確認する
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
