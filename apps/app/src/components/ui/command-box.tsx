import { Badge } from "@repo/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@repo/ui/dialog-controlled";
import { Input } from "@repo/ui/input";

import { appWindow } from "@tauri-apps/api/window";
import { current, produce } from "immer";
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { UiState } from "~/lib/types";
import { useUiState } from "~/lib/ui-store";

interface CommandProps {
  title: string;
  shortcut: React.ReactNode;
}

// TODO : focus isn't currently correct, it should work more like vs code does
const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ title, shortcut }, ref) => {
    return (
      <div
        className="py-2 text-muted-foreground flex items-center justify-between focus:ring-1 focus:ring-white rounded-md"
        ref={ref}
        tabIndex={0}
      >
        <span>{title}</span>
        {shortcut}
      </div>
    );
  }
);

const CommandList = ({
  onCommandExecution,
}: {
  onCommandExecution: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const uiState = useUiState((state) => state.uiState);
  const setUiState = useUiState((state) => state.setUiState);
  const searchInput = useRef<HTMLInputElement>(null);
  const currentFocus = useRef(-1);

  const commands = useMemo(() => {
    const noteCommands = [
      {
        title: "Save note",
        desc: "Saves the current note.",
        action: () => {
          console.log("saving note");
        },
        shortcut: (
          <>
            <Badge className="px-1">Ctrl + S</Badge>
          </>
        ),
      },
    ];

    const commandDialogCommands = [
      {
        title: "Open command palette",
        desc: "Opens command palette.",
        action: () => {},
        shortcut: (
          <>
            <Badge className="px-1">Ctrl + K</Badge>
          </>
        ),
      },
      {
        title: "Close command palette",
        desc: "Closes command palette.",
        action: () => {},
        shortcut: (
          <>
            <Badge className="px-1">Esc</Badge>
          </>
        ),
      },
    ];

    return [
      ...noteCommands,
      ...commandDialogCommands,
      {
        title: "Minimise window",
        desc: "Minimises the window.",
        action: () => {
          appWindow.minimize();
        },
        shortcut: <></>,
      },
      {
        title: "Maximise window",
        desc: "Maximises the window.",
        action: () => {
          appWindow.maximize();
        },
        shortcut: <></>,
      },
      {
        title: "Close window",
        desc: "Closes the window.",
        action: () => {
          appWindow.close();
        },
        shortcut: <></>,
      },
      {
        title: "Toggle titlebar",
        desc: "Hide or show the titlebar",
        action: (currUiState: UiState) => {
          setUiState(
            produce(uiState, (draft) => {
              draft.titlebar = !currUiState.titlebar;
            })
          );
        },
        shortcut: <></>,
      },
    ];
  }, []);

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (filtered.length == 1) {
      filtered[0]?.action(uiState);
      onCommandExecution();
      return;
    }

    if (currentFocus.current > -1) {
      onCommandExecution();
    }
  };

  useHotkeys("enter", () => onSubmit(), {
    enableOnFormTags: false,
  });

  useEffect(() => {
    console.log("rerendering uistate ", uiState);
  }, [uiState.titlebar]);

  const [filtered, filteredRefs] = useMemo(() => {
    if (searchTerm == "")
      return [commands, commands.map(() => createRef<HTMLDivElement>())];

    const formattedSearchTerm = searchTerm.toLocaleLowerCase();

    const res = commands.filter((command) =>
      command.title.toLocaleLowerCase().includes(formattedSearchTerm)
    );

    // Make sure current focus is not out of bounds it list became shorter
    while (currentFocus.current >= res.length) {
      currentFocus.current -= 1;
    }

    return [res, res.map(() => createRef<HTMLDivElement>())];
  }, [searchTerm]);

  const updateCurrentFocus = (i: number) => {
    if (
      currentFocus.current + i < -1 ||
      currentFocus.current + i >= filteredRefs.length
    ) {
      return;
    }

    currentFocus.current += i;
    console.log(currentFocus.current);

    if (currentFocus.current == -1) {
      searchInput.current?.focus();
    } else {
      filteredRefs[currentFocus.current].current?.focus();
    }
  };

  useHotkeys(
    "down",
    () => {
      updateCurrentFocus(1);
    },
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    "up",
    () => {
      updateCurrentFocus(-1);
    },
    {
      enableOnFormTags: true,
    }
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input
          // autoFocus
          ref={searchInput}
          onFocus={() => (currentFocus.current = -1)}
          placeholder="Enter command"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div
        className={`p-2 ${filtered.length == 1 ? "ring-1" : ""} rounded-md ring-primary mt-4`}
      >
        {filtered.map((command, index) => (
          <Command
            ref={filteredRefs[index]}
            key={command.title}
            title={command.title}
            shortcut={command.shortcut}
          />
        ))}
      </div>
    </div>
  );
};

export default function CommandBox() {
  const [opened, setOpened] = useState(false);
  useState;

  useHotkeys("ctrl+k", () => setOpened((prev) => !prev), {
    enableOnFormTags: true,
  });
  useHotkeys("esc", () => setOpened(false), {
    enableOnFormTags: true,
  });

  return (
    <Dialog open={opened}>
      <DialogContent>
        <DialogHeader>
          {/* <div className="flex items-center justify-between">
            <DialogTitle className="w-fit">Command</DialogTitle>
            <DialogClose onClick={() => setOpened(false)}>
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div> */}
          {/* <DialogDescription>Enter command</DialogDescription> */}
          <CommandList onCommandExecution={() => setOpened(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}