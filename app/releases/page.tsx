import AppNavbar from "@/components/app/AppNavbar";
import { Skeleton } from "@/components/ui/skeleton";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { Suspense } from "react";

interface ReleaseNote {
  version: string;
  content: string;
  filename: string;
}

async function getReleaseNotes(): Promise<ReleaseNote[]> {
  try {
    const releasesDir = join(process.cwd(), "releases");
    const files = await readdir(releasesDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const releases = await Promise.all(
      mdFiles.map(async (filename) => {
        const content = await readFile(join(releasesDir, filename), "utf-8");
        const version = filename.replace(".md", "");
        return { version, content, filename };
      })
    );

    // Sort by version (newest first)
    return releases.sort((a, b) => b.version.localeCompare(a.version));
  } catch (error) {
    console.error("Error reading release notes:", error);
    return [];
  }
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown to HTML conversion for basic formatting
  const htmlContent = content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(
      /^## (.*$)/gm,
      '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>'
    )
    .replace(
      /^### (.*$)/gm,
      '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>'
    )
    .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-4 mb-4">$1</ul>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|u|l])(.*$)/gm, '<p class="mb-4">$1</p>');

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

function ReleaseNotesContent() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-4xl font-bold mb-8">Release Notes</h1>
      <Suspense fallback={<ReleaseNotesSkeleton />}>
        <ReleaseNotesList />
      </Suspense>
    </div>
  );
}

async function ReleaseNotesList() {
  const releases = await getReleaseNotes();

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No release notes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {releases.map((release) => (
        <div
          key={release.version}
          className="border-b border-border pb-8 last:border-b-0"
        >
          <MarkdownContent content={release.content} />
        </div>
      ))}
    </div>
  );
}

function ReleaseNotesSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReleasesPage() {
  return (
    <>
      <AppNavbar />
      <ReleaseNotesContent />
    </>
  );
}
