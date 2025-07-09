import Image from "next/image";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
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
  const data = await res.json();
  console.log(data);

  return (
    <article className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{data.full_name}</h1>
      <Image
        src={data.owner.avatar_url}
        alt={data.owner.login}
        width={64}
        height={64}
        className="rounded-full mb-4"
      />
      <p>言語: {data.language ?? "不明"}</p>
      <p>⭐ Stars: {data.stargazers_count}</p>
      <p>👀 Watchers: {data.watchers_count}</p>
      <p>🍴 Forks: {data.forks_count}</p>
      <p>❗ Issues: {data.open_issues_count}</p>
    </article>
  );
}
