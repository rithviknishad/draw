import {
  CopyPlus,
  InfoIcon,
  StickyNoteIcon,
  TextCursorInputIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import React, { lazy, Suspense, useMemo, useState } from "react";
import { configAtom } from "@/lib/draw";
import { useAtom } from "jotai/react";
import { ulid } from "ulidx";
import { toast } from "sonner";
import { isAppleDevice, sleep, timeAgo } from "@/lib/utils";
const ExcalidrawPage = lazy(() => import("@/components/ExcalidrawPage"));

function App() {
  const [cmdSearch, setCmdSearch] = useState("");
  const [cmdOpen, setCmdOpen] = React.useState(false);

  const [config, setConfig] = useAtom(configAtom);

  const pagesSorted = config.pages.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const createNewPage = (title: string) => {
    const slug = ulid();
    const now = new Date().toISOString();

    const newPage = {
      slug,
      title,
      createdAt: now,
      updatedAt: now,
    };

    setConfig((config) => ({
      ...config,
      pages: [...config.pages, newPage],
    }));

    return newPage;
  };

  const [currentSlug, setCurrentSlug] = useState(
    pagesSorted[0]?.slug ?? createNewPage("Your first page!").slug
  );

  const current = useMemo(() => {
    if (currentSlug) {
      return config.pages.find((page) => page.slug === currentSlug);
    }
  }, [currentSlug, config.pages]);

  React.useEffect(() => {
    (async () => {
      await sleep(1000);
      toast(
        `Press ${
          isAppleDevice ? "Cmd" : "Ctrl"
        }+P to switch pages or perform other actions`,
        {
          duration: 8e3,
          position: "bottom-center",
          icon: <InfoIcon size={16} />,
          invert: true,
        }
      );
    })();

    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (callback: () => void) => {
    return () => {
      callback();

      setCmdOpen(false);
      setCmdSearch("");
    };
  };

  return (
    <>
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput
          placeholder="Type a command or search pages..."
          value={cmdSearch}
          onValueChange={setCmdSearch}
        />
        <CommandList>
          <CommandEmpty>No pages or command found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {pagesSorted
              .filter(({ slug }) => slug !== currentSlug)
              .map((page) => {
                const updatedAt = new Date(page.updatedAt);
                return (
                  <CommandItem
                    key={page.slug}
                    onSelect={runCommand(() => setCurrentSlug(page.slug))}
                  >
                    <StickyNoteIcon className="mr-4" />
                    <span>
                      <p className="font-bold">{page.title}</p>
                    </span>
                    <CommandShortcut>
                      <time
                        className="tracking-normal"
                        title={updatedAt.toISOString()}
                        dateTime={page.updatedAt}
                      >
                        {timeAgo(updatedAt)}
                      </time>
                    </CommandShortcut>
                  </CommandItem>
                );
              })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={runCommand(() => {
                setCurrentSlug(createNewPage(cmdSearch || "Untitled").slug);
              })}
            >
              <CopyPlus className="mr-2 h-4 w-4" />
              <span>
                Create new page: <strong>{cmdSearch || "Untitled"}</strong>
              </span>
              <CommandShortcut className="hidden">⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              className={cmdSearch ? "" : "hidden"}
              onSelect={runCommand(() => {
                setConfig((c) => ({
                  ...c,
                  pages: c.pages.map((p) =>
                    p.slug === currentSlug ? { ...p, title: cmdSearch } : p
                  ),
                }));
              })}
            >
              <TextCursorInputIcon className="mr-2 h-4 w-4" />
              <span>
                Rename page to: <strong>{cmdSearch || "Untitled"}</strong>
              </span>
              <CommandShortcut className="hidden">
                For some reason removing this element hides this entry when
                search is entered.
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <main className="relative h-screen">
        <div className="h-full w-full">
          {current && (
            <Suspense fallback={"loading"}>
              <ExcalidrawPage slug={current.slug} />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
