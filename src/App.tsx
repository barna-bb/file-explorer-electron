import { useState, useMemo } from "react";

import { Dirent, Stats } from "fs";
import { join, dirname } from 'path';
import FilesViewer from "./components/FilesViewer";

const fs = window.require('fs') as typeof import('fs');
/* const pathModule = window.require('path') as typeof import('path'); */

const { app } = window.require('@electron/remote');

interface FileItem {
  name: string,
  size: string | null;
  directory: boolean;
}

const formatSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    ((size / Math.pow(1024, i)) as number).toFixed(2) +
    ' ' + 
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

function App() {

  const [path, setPath] = useState<string>(app.getAppPath());
  const [searchString, setSearchString] = useState<string>('');

  const files: FileItem[] = useMemo(() => 
  fs
  .readdirSync(Buffer.from(path, 'utf-8'), { withFileTypes: true })
  .map((dirent: Dirent) => {
    const stats: Stats = fs.statSync(join(path, dirent.name));
    return {
      name: dirent.name,
      size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
      directory: stats.isDirectory()
    }
  })
  .sort((a, b) => {
    if (a.directory === b.directory) {
      return a.name.localeCompare(b.name);
    }
    return a.directory ? -1 : 1
  }), [path]);

  const onBack = () => setPath(dirname(path));
  const onOpen = (folder: string) => setPath(join(path, folder));

  const filteredFiles = searchString ? files.filter(s => s.name.startsWith(searchString)) : files;
  
  return (
    <div className="container mt-2">
      <h4 className="mt-4">{path}</h4>
      <div className="mt-4 mb-2">
        <input
          type="text"
          value={searchString}
          onChange={event => setSearchString(event.target.value)}
          className="w-full py-2 px-4 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
          placeholder="file search"
        />
      </div>
      <FilesViewer files={filteredFiles} onBack={onBack} onOpen={onOpen} />
    </div>
  )
}

export default App