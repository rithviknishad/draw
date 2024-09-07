import { atomWithStorage } from "jotai/utils";

export type Config = {
  theme: "system" | "light" | "dark";
  pages: {
    slug: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export const configAtom = atomWithStorage<Config>(
  "draw-config",
  {
    theme: "system",
    pages: [],
  },
  undefined,
  { getOnInit: true }
);
