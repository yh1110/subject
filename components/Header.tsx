import Link from "next/link";
import { GithubIcon } from "@yamada-ui/lucide";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <GithubIcon className="h-6 w-6 text-white" data-testid="github-icon" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              GitHub Repository Search
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              リポジトリを発見・探索
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
