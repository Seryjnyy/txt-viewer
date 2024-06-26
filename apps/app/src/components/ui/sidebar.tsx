import { FileIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import ModeToggle from "@repo/ui/mode-toggle";
import { produce } from "immer";
import { useTempUiState } from "~/lib/temp-uistate-store";
import { useUiState } from "~/lib/ui-store";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { ReactNode } from "react";

interface SidebarButtonInterface {
  children: ReactNode;
  tooltip: string;
  active?: boolean;
  action?: () => void;
}

const SidebarTooltip = ({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) => {
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SidebarButton = ({
  children,
  tooltip,
  active,
  action,
}: SidebarButtonInterface) => {
  return (
    <SidebarTooltip content={tooltip}>
      <Button
        variant="ghost"
        className={`rounded-none text-primary  ${active ? "border-primary border-l" : ""}`}
        onClick={() => {
          if (action) {
            action();
          }
        }}
      >
        {children}
      </Button>
    </SidebarTooltip>
  );
};

export default function Sidebar() {
  const tempUiState = useTempUiState((state) => state.tempUiState);
  const setTempUiState = useTempUiState((state) => state.setTempUiState);
  const uiState = useUiState((state) => state.uiState);
  const setUiState = useUiState((state) => state.setUiState);

  return (
    <div className="w-12 h-screen pt-8 bg-secondary">
      <div className="flex flex-col">
        <SidebarButton
          tooltip="File manager"
          active={uiState.sideSection == "file-explorer"}
          action={() =>
            setUiState(
              produce(uiState, (draft) => {
                if (uiState.sideSection == "file-explorer") {
                  draft.sideSection = "none";
                } else {
                  draft.sideSection = "file-explorer";
                }
              })
            )
          }
        >
          <FileIcon className="w-4 h-4" />
        </SidebarButton>

        {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-manager" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost" onClick={() => setUiState(produce(uiState, draft => {
            draft.sidebarActive = 
          }))}>
            m<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}
        {/* <div className="flex justify-center items-center relative">
          {uiState.section == "note-viewer" && (
            <div className="h-full w-[0.15rem] bg-primary left-0 absolute"></div>
          )}
          <Button className="" variant="ghost">
            v<FileIcon className="w-4 h-4" />
          </Button>
        </div> */}
        <SidebarButton
          action={() =>
            setTempUiState(
              produce(tempUiState, (draft) => {
                draft.settingsOpened = true;
              })
            )
          }
          active={tempUiState.settingsOpened}
          tooltip="Settings"
        >
          <GearIcon className="w-4 h-4" />
        </SidebarButton>
        <SidebarTooltip content="Dark/Light mode">
          <div>
            <ModeToggle />
          </div>
        </SidebarTooltip>
      </div>
    </div>
  );
}
