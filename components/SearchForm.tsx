"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@yamada-ui/react";
import { SearchIcon } from "@yamada-ui/lucide";

export type SearchFormData = {
  q: string;
};

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void;
  loading?: boolean;
}

export function SearchForm({ onSubmit, loading = false }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    defaultValues: { q: "" },
  });

  return (
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
                  {...register("q", { 
                    validate: (value) => 
                      !value || value.trim() === "" ? "キーワードは必須です" : undefined
                  })}
                  placeholder="キーワードを入力してください"
                  pl="12"
                  data-testid="search-input"
                />
              </InputGroup>
              <Button type="submit" disabled={loading} px="8" data-testid="search-button">
                {loading ? "検索中..." : "検索"}
              </Button>
            </HStack>
          </form>
          
          {/* エラー表示 */}
          {errors.q && (
            <Text color="red.500" textAlign="center" mt="4" data-testid="validation-error">
              {errors.q.message}
            </Text>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}