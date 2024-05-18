import { useEffect, useState } from "react";
import {
  FileEntryWithMetadata,
  getAllFilesInFolderWithMetadata,
} from "~/lib/file-services/directory-service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useOpenedTabs } from "~/lib/opene-tabs-store";
import { produce } from "immer";
import {
  changeStoredCurrentTab,
  changeStoredOpenedTabs,
} from "~/lib/file-services/tab-service";

const File = ({ data }: { data: FileEntryWithMetadata }) => {
  const setCurrentTab = useOpenedTabs((state) => state.setCurrentTab);
  const openedTabs = useOpenedTabs((state) => state.openedTabs);
  const setOpenedTabs = useOpenedTabs((state) => state.setOpenedTabs);

  return (
    <div
      className="bg-gray-500 px-2 hover:bg-gray-300 rounded-md text-ellipsis"
      onClick={() => {
        console.log(data.metadata);

        setCurrentTab(data.name ?? "unknown");
        changeStoredCurrentTab(data.name ?? "");

        // Only add once
        if (openedTabs.find((tab) => tab.title == data.name) == undefined) {
          setOpenedTabs(
            produce(openedTabs, (draft) => {
              draft.push({
                id: "idk",
                filepath: data.path,
                title: data.name ?? "unknown",
              });
            })
          );
          console.log("opened tabs", openedTabs);
          changeStoredOpenedTabs(openedTabs);
        }
      }}
    >
      {data.name}
    </div>
  );
};

const Folder = ({ data }: { data: FileEntryWithMetadata }) => {
  return (
    <Collapsible>
      <CollapsibleTrigger
        className="bg-slate-800 px-2 w-full hover:bg-gray-300 rounded-md text-start flex items-center gap-2"
        onClick={() => console.log(data.metadata)}
      >
        <CaretDownIcon /> <span>{data.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">
        {data.children &&
          data.children.map((file, index) => {
            if (file.children) {
              return <Folder data={file} key={index} />;
            }

            return <File data={file} key={index} />;
          })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function FileExplorer() {
  const [files, setFiles] = useState<FileEntryWithMetadata[]>([]);

  useEffect(() => {
    const setUp = async () => {
      const res = await getAllFilesInFolderWithMetadata(
        "C:\\Users\\jakub\\Documents\\test"
      );

      setFiles(res);
    };
    setUp();
  }, []);

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div>{"directory"}</div>
      <div className="bg-gray-700 flex flex-col px-2 gap-2">
        {files.map((file, index) => {
          if (file.children) {
            return <Folder data={file} key={index} />;
          }

          return <File data={file} key={index} />;
        })}
      </div>
    </div>
  );
}
