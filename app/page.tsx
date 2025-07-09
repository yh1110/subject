"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  InfiniteScrollArea,
  Input,
  Loading,
  Text,
  VStack,
} from "@yamada-ui/react";

type SearchForm = {
  q: string;
};

interface Repo {
  id: number;
  full_name: string;
  description: string | null;
  owner: { login: string; avatar_url: string };
}

export default function SearchPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [query, setQuery] = useState<string>("");
  const resetRef = useRef<() => void>(() => {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchForm>({
    defaultValues: { q: "" },
  });

  const onSubmit = async ({ q }: SearchForm) => {
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
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message || "検索に失敗しました");
      } else {
        setError("検索に失敗しました");
      }
      // エラーハンドリング
    } finally {
      setLoading(false);
    }
  };

  // 検証用
  console.log("Current search query:", watch("q"));

  return (
    <Container as="main">
      <Container centerContent>
        <Heading>GitHub Repository Search</Heading>
        <Text color="gray.500">
          Githubのリポジトリを検索、各リポジトリの詳細を調べることができます
        </Text>
      </Container>
      {/* 検索欄 */}
      <Container centerContent>
        <Card size={{ base: "lg", sm: "md" }} maxW="3xl" w="full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
              <Grid templateColumns="repeat(4, 1fr)" gap="md">
                <GridItem w="full" colSpan={3} rounded="xs">
                  <Input
                    {...register("q", { required: "キーワードは必須です" })}
                    placeholder="検索キーワード"
                    w="full"
                  />
                </GridItem>
                <GridItem w="full" rounded="xs">
                  <Button type="submit" disabled={loading} w="full">
                    {loading ? "検索中…" : "検索"}
                  </Button>
                </GridItem>
              </Grid>
            </form>
          </CardBody>
        </Card>
      </Container>
      {errors.q && <Text color="red.500">{errors.q.message}</Text>}
      {error && <Text color="red.500">{error}</Text>}
      <VStack>
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
              // 20件未満ならもう次ページはないので finish()
              if (items.length < 20) {
                finish();
              }
            }}
            // 読み込み中に表示するコンポーネント（オリジナルのスタイルに合わせています）
            loading={<Loading />}
          >
            {repos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repos/${repo.owner.login}/${
                  repo.full_name.split("/")[1]
                }`}
              >
                <Card
                  flexDirection={{ base: "row" }}
                  overflow="hidden"
                  variant="outline"
                >
                  <Center w="20">
                    <Image
                      src={repo.owner.avatar_url}
                      alt="github avatar"
                      objectFit="cover"
                      boxSize="15"
                      rounded="full"
                    />
                  </Center>

                  <VStack gap="0">
                    <CardHeader>
                      <Heading size="md">{repo.full_name}</Heading>
                    </CardHeader>

                    <CardBody>
                      <Text>{repo.description}</Text>
                    </CardBody>
                  </VStack>
                </Card>
              </Link>
            ))}
          </InfiniteScrollArea>
        )}
      </VStack>
    </Container>
  );
}
