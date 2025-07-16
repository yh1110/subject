"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Grid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Avatar,
  Heading,
  Text,
  IconButton,
  Button,
  Tag,
  InfiniteScrollArea,
  Loading,
  Container,
} from "@yamada-ui/react";
import {
  StarIcon,
  GitForkIcon,
  EyeIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from "@yamada-ui/lucide";
import { formatDate, formatNumber } from "@/lib/formatters";

export interface Repo {
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

interface SearchResultsProps {
  repos: Repo[];
  totalCount: number;
  query: string;
  loading: boolean;
  searched: boolean;
  onLoadMore: (page: number) => Promise<Repo[]>;
  onSetRepos: (repos: Repo[]) => void;
}

export function SearchResults({
  repos,
  totalCount,
  query,
  loading,
  searched,
  onLoadMore,
  onSetRepos,
}: SearchResultsProps) {
  const resetRef = useRef<() => void>(() => {});

  if (!searched) {
    return null;
  }

  return (
    <>
      {/* 総リポジトリ数 */}
      {!loading && (
        <Text textAlign="center" mb="6">
          Found {totalCount.toLocaleString()} repositories
        </Text>
      )}

      {/* リポジトリ一覧 */}
      {repos.length > 0 && (
        <InfiniteScrollArea
          resetRef={resetRef}
          onLoad={async ({ finish }) => {
            const nextPage = Math.floor(repos.length / 20) + 1;
            const newRepos = await onLoadMore(nextPage);
            onSetRepos([...repos, ...newRepos]);
            if (newRepos.length < 20) {
              finish();
            }
          }}
          loading={<Loading variant="dots" fontSize="5xl" />}
          data-testid="infinite-scroll"
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
                href={`/repos/${repo.owner.login}/${repo.full_name.split("/")[1]}`}
                target="_blank"
                data-testid={`repo-card-${repo.id}`}
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

                    <Button variant="outline" w="full" mt="4" colorScheme="gray">
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
      {repos.length === 0 && !loading && (
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
    </>
  );
}