import { DraftingCompass } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 h-full w-full items-center justify-between p-16">
      <div />
      <DraftingCompass size={128} className="text-[#eef35f] animate-pulse" />
      <span>
        Contribute on{" "}
        <a
          className="underline underline-offset-2"
          href="https://github.com/rithviknishad/draw"
          target="_blank"
        >
          github.com/rithviknishad/draw
        </a>
      </span>
    </div>
  );
}
