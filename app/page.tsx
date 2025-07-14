"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Grid,
  Heading,
  InfiniteScrollArea,
  Input,
  Text,
  VStack,
  HStack,
  Avatar,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle,
  IconButton,
  Loading,
  Tag,
  UIProvider,
} from "@yamada-ui/react";
import {
  SearchIcon,
  StarIcon,
  GitForkIcon,
  EyeIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from "@yamada-ui/lucide";

type SearchForm = {
  q: string;
};

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export default function SearchPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [query, setQuery] = useState<string>("");
  const resetRef = useRef<() => void>(() => {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchForm>({
    defaultValues: { q: "" },
  });

  const onSubmit = async ({ q }: SearchForm) => {
    if (!q.trim()) return;

    setLoading(true);
    setRepos([]);
    setQuery(q);
    setError(null);
    resetRef.current();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      console.log("Search results:", json);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // 検証用
  console.log("Current search query:", watch("q"));
  console.log("set search query:", query);

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

        {/* 検索欄 */}
        <Container centerContent py={0}>
          <Card maxW="3xl" shadow="lg" size={{ base: "lg", sm: "md" }} w="full">
            <CardBody p="6">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <HStack gap="4">
                  <InputGroup flex="1">
                    <InputLeftElement>
                      <SearchIcon fontSize={20} />
                    </InputLeftElement>
                    <Input
                      {...register("q", { required: "キーワードは必須です" })}
                      placeholder="キーワードを入力してください"
                      pl="12"
                    />
                  </InputGroup>
                  <Button type="submit" disabled={loading} px="8">
                    {loading ? "検索中..." : "検索"}
                  </Button>
                </HStack>
              </form>
            </CardBody>
          </Card>
        </Container>

        {/* エラー */}
        {errors.q && (
          <Text color="red.500" textAlign="center" mb="4">
            {errors.q.message}
          </Text>
        )}
        {error && (
          <Text color="red.500" textAlign="center" mb="4">
            {error}
          </Text>
        )}

        {/* 総リポジトリ数 */}
        {searched && !loading && (
          <Text textAlign="center" mb="6">
            Found {totalCount.toLocaleString()} repositories
          </Text>
        )}
        {/* リポジトリ一覧 */}
        {repos.length > 0 && (
          <InfiniteScrollArea
            resetRef={resetRef}
            onLoad={async ({ finish, index }) => {
              const nextPage = Math.floor(repos.length / 20) + 1;
              const res = await fetch(
                `/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`
              );
              console.log(index, "Loading page:", nextPage);
              const json = await res.json();
              const items: Repo[] = json.items ?? [];
              setRepos((prev) => [...prev, ...items]);
              if (items.length < 20) {
                finish();
              }
            }}
            loading={<Loading variant="dots" fontSize="5xl" />}
          >
            <Grid
              templateColumns={{
                base: "repeat(3, 1fr)",
                md: "repeat(2, 1fr)",
                sm: "repeat(1, 1fr)",
              }}
              gap="6"
            >
              {repos.map((repo) => (
                <Link
                  key={repo.id}
                  href={`/repos/${repo.owner.login}/${
                    repo.full_name.split("/")[1]
                  }`}
                  target="_blank"
                >
                  <Card
                    _hover={{
                      shadow: "xl",
                      transform: "translateY(-4px)",
                    }}
                    transition="all 0.3s"
                    cursor="pointer"
                  >
                    <CardHeader pb="3" w="full">
                      <HStack justify="space-between" align="start" w="full">
                        <HStack gap="3" minW="0" flex="1">
                          <Avatar
                            src={repo.owner.avatar_url}
                            name={repo.owner.login}
                            size="sm"
                          />
                          <VStack align="start" minW="0" flex="1" gap="0">
                            <Heading size="md" lineClamp={1}>
                              {repo.name}
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                              {repo.owner.login}
                            </Text>
                          </VStack>
                        </HStack>

                        <IconButton
                          aria-label="GitHub detail"
                          icon={<ExternalLinkIcon fontSize={16} />}
                          variant="ghost"
                          size="sm"
                          transition="opacity 0.2s"
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody pt="0">
                      <Text fontSize="sm" lineClamp={3} minH="3rem">
                        {repo.description || "(No description)"}
                      </Text>

                      <HStack gap="4" mt="4" fontSize="sm" color="gray.500">
                        <HStack gap="1">
                          <StarIcon fontSize={16} />
                          <Text>{formatNumber(repo.stargazers_count)}</Text>
                        </HStack>
                        <HStack gap="1">
                          <GitForkIcon fontSize={16} />
                          <Text>{formatNumber(repo.forks_count)}</Text>
                        </HStack>
                        <HStack gap="1">
                          <EyeIcon fontSize={16} />
                          <Text>{formatNumber(repo.watchers_count)}</Text>
                        </HStack>
                      </HStack>

                      <HStack justify="space-between" mt="4">
                        {repo.language && (
                          <Tag variant="subtle" fontSize="xs">
                            {repo.language}
                          </Tag>
                        )}
                        <HStack gap="1" fontSize="xs" color="gray.500">
                          <CalendarIcon fontSize={12} />
                          <Text>{formatDate(repo.updated_at)}</Text>
                        </HStack>
                      </HStack>

                      <Button
                        variant="outline"
                        w="full"
                        mt="4"
                        colorScheme="gray"
                      >
                        詳細を見る
                      </Button>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </Grid>
          </InfiniteScrollArea>
        )}

        {/* 検索結果無し */}
        {searched && repos.length === 0 && !loading && (
          <Container centerContent>
            <HStack color="gray.700">
              <Text fontSize="6xl" mb="4">
                🔍
              </Text>
              <Heading size="xl" mb="2">
                キーワードに一致するリポジトリは存在しません
              </Heading>
            </HStack>
            <Text color="gray.500">
              別のキーワードで再度検索しなおしてください
            </Text>
          </Container>
        )}

        {/* ローディングスケルトン */}
        {loading && repos.length === 0 && (
          <Grid
            templateColumns={{
              base: "repeat(3, 1fr)",
              md: "repeat(2, 1fr)",
              sm: "repeat(1, 1fr)",
            }}
            gap="6"
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
