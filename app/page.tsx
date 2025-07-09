"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

type SearchForm = {
  q: string;
};

interface Repo {
  id: number;
  full_name: string;
  owner: { login: string; avatar_url: string };
}

export default function SearchPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

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
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setRepos(json.items ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 検証用
  console.log("Current search query:", watch("q"));

  return (
    <main className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex gap-2">
        <input
          {...register("q", { required: "キーワードは必須です" })}
          placeholder="検索キーワード"
          className="flex-1 border px-2 py-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "検索中…" : "検索"}
        </button>
      </form>
      {errors.q && <p className="text-red-500 mb-4">{errors.q.message}</p>}
      <ul className="space-y-2">
        {repos.map((r) => (
          <li key={r.id}>
            <Link
              href={`/repos/${r.owner.login}/${r.full_name.split("/")[1]}`}
              className="text-blue-500"
            >
              {r.full_name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
