import type { Metadata } from "next";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;

  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "force-cache",
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!res.ok) {
      return {
        title: `${owner}/${repo} - Repository Details`,
        description: `GitHub repository details for ${owner}/${repo}`,
      };
    }

    const data = await res.json();

    const title = `${data.full_name} - GitHub Repository`;
    const description = data.description
      ? `${data.description} - ${
          data.language ? `Built with ${data.language}` : ""
        } | ${data.stargazers_count} stars, ${data.forks_count} forks`
      : `GitHub repository ${data.full_name} - ${
          data.language ? `Built with ${data.language}` : ""
        } | ${data.stargazers_count} stars, ${data.forks_count} forks`;

    return {
      title,
      description,
      keywords: [
        data.name,
        data.owner.login,
        "GitHub",
        "リポジトリ",
        "repository",
        data.language,
        ...data.topics,
      ].filter(Boolean),
      authors: [{ name: data.owner.login, url: data.owner.html_url }],
      creator: data.owner.login,
      publisher: "GitHub",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        type: "website",
        locale: "ja_JP",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/repos/${owner}/${repo}`,
        title,
        description,
        siteName: "GitHub Repository Search",
        images: [
          {
            url: data.owner.avatar_url,
            width: 400,
            height: 400,
            alt: `${data.owner.login} avatar`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: `@${data.owner.login}`,
        images: [data.owner.avatar_url],
      },
      alternates: {
        canonical: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/repos/${owner}/${repo}`,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: `${owner}/${repo} - Repository Details`,
      description: `GitHub repository details for ${owner}/${repo}`,
    };
  }
}

export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
