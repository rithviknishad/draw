import { configAtom } from "@/lib/draw";
import { Excalidraw } from "@excalidraw/excalidraw";
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { useAtom } from "jotai/react";
import React from "react";
import { toast } from "sonner";
import { getMany, setMany } from "idb-keyval";
import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { debounce, sleep } from "@/lib/utils";

type PageOnLocalStorage = {
  elements: readonly ExcalidrawElement[];
  fileIds: string[];
};

type Page = {
  elements: readonly ExcalidrawElement[];
  files: BinaryFiles;
};

const getPage = async (id: string) => {
  const pageJson = localStorage.getItem(`draw-page-${id}`);
  if (pageJson) {
    try {
      const data = JSON.parse(pageJson) as PageOnLocalStorage;

      const filesFromDB = await getMany(data.fileIds);
      const files = Object.fromEntries(filesFromDB.map((obj) => [obj.id, obj]));

      return {
        elements: data.elements,
        files,
      } satisfies Page;
    } catch (e) {
      toast.error(`${e}`);
    }
  }
  return null;
};

type Props = {
  slug: string;
};

export default function ExcalidrawPage(props: Props) {
  const [config, setConfig] = useAtom(configAtom);
  const [page, setPage] = React.useState<Page | null>();

  React.useEffect(() => {
    setPage(undefined);

    async function load() {
      await sleep(50);
      const page = await getPage(props.slug);
      setPage(page);
    }

    load();
  }, [props.slug]);

  if (page === undefined) {
    return "loading...";
  }

  return (
    <Excalidraw
      key={props.slug}
      name={props.slug}
      initialData={{
        elements: page?.elements ?? [],
        files: page?.files ?? {},
        appState: {
          theme: config.theme === "light" ? "light" : "dark",
        },
      }}
      onChange={debounce(async (elements, appState, files) => {
        const key = `draw-page-${appState.name}`;

        const value = JSON.stringify({
          elements,
          fileIds: Object.keys(files),
        } satisfies PageOnLocalStorage);

        const existing = localStorage.getItem(key);

        if (value === existing) {
          return;
        }

        localStorage.setItem(key, value);

        setMany(Object.entries(files));

        setConfig((config) => ({
          ...config,
          pages: config.pages.map((page) =>
            page.slug === appState.name
              ? { ...page, updatedAt: new Date().toISOString() }
              : page
          ),
        }));
      }, 100)}
    />
  );
}
