import { IconFile, IconFolder, IconFolderOpen } from "./Icons";

interface FileItem {
    name: string;
    directory: boolean;
    size: string | null;
}

interface FilesViewerProps {
    files: FileItem[];
    onBack: () => void;
    onOpen: (folder: string) => void;
}

function FilesViewer({ files, onBack, onOpen }: FilesViewerProps): JSX.Element {
  return (
    <table className="table">
        <tbody>
            <tr className="cursor-pointer" onClick={onBack}>
                <td className="icon-row">
                    <IconFolderOpen />
                </td>
                <td>...</td>
                <td></td>
            </tr>

            {files.map(({ name, directory, size }, index) => {
                return (
                    <tr className="cursor-pointer" onClick={() => directory && onOpen(name)} key={index}>
                    <td className="icon-row">
                        {directory ? <IconFolder /> : <IconFile />}
                    </td>
                    <td>{name}</td>
                    <td>
                        <span className="float-right">{size}</span>
                    </td>
                </tr>
                )
            })}
        </tbody>
    </table>
  );
}

export default FilesViewer;