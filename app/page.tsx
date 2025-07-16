"use client";

import { useState } from "react";
import {
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  Card,
  CardHeader,
  CardBody,
  UIProvider,
} from "@yamada-ui/react";
import { SearchForm, SearchFormData } from "@/components/SearchForm";
import { SearchResults, Repo } from "@/components/SearchResults";

export default function SearchPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async ({ q }: SearchFormData) => {
    if (!q.trim()) return;

    setLoading(true);
    setRepos([]);
    setQuery(q);
    setError(null);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();

      setRepos(json.items ?? []);
      setTotalCount(json.total_count || 0);
      setSearched(true);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message || "検索に失敗しました");
      } else {
        setError("検索に失敗しました");
      }
      setRepos([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async (page: number): Promise<Repo[]> => {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    const json = await res.json();
    return json.items ?? [];
  };

  return (
    <UIProvider>
      <Container as="main" maxW="container.xl" py="8">
        {/* トップテキスト */}
        <Container centerContent>
          <Heading size="4xl" fontWeight="bold" mb="4">
            GitHub Repository Search
          </Heading>
          <Text fontSize="lg" maxW="container.md" color="gray.500">
            GitHubリポジトリの一覧と、各リポジトリの詳細を確認できます。
          </Text>
        </Container>

        {/* 検索フォーム */}
        <SearchForm onSubmit={handleSearch} loading={loading} />

        {/* API エラー */}
        {error && (
          <Text color="red.500" textAlign="center" mb="4" data-testid="api-error">
            {error}
          </Text>
        )}

        {/* 検索結果 */}
        <SearchResults
          repos={repos}
          totalCount={totalCount}
          query={query}
          loading={loading}
          searched={searched}
          onLoadMore={handleLoadMore}
          onSetRepos={setRepos}
        />

        {/* ローディングスケルトン */}
        {loading && repos.length === 0 && (
          <Grid
            templateColumns={{
              base: "repeat(3, 1fr)",
              md: "repeat(2, 1fr)",
              sm: "repeat(1, 1fr)",
            }}
            gap="6"
            data-testid="loading-skeleton"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <HStack gap="3">
                    <SkeletonCircle size="8" />
                    <VStack align="start" gap="2" flex="1">
                      <Skeleton height="4" width="75%" />
                      <Skeleton height="3" width="50%" />
                    </VStack>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack gap="2" mt="4">
                    <Skeleton height="3" />
                    <Skeleton height="3" width="85%" />
                    <Skeleton height="3" width="70%" />
                  </VStack>
                  <HStack gap="4" mt="4">
                    <Skeleton height="4" width="12" />
                    <Skeleton height="4" width="12" />
                    <Skeleton height="4" width="12" />
                  </HStack>
                  <Skeleton height="8" mt="4" />
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </UIProvider>
  );
}
