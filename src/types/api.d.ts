interface IResGetNotebookConf {
    box: string;
    conf: NotebookConf;
    name: string;
}

interface IReslsNotebooks {
    notebooks: Notebook[];
}

interface IResUpload {
    errFiles: string[];
    succMap: { [key: string]: string };
}

interface IResdoOperations {
    doOperations: doOperation[];
    undoOperations: doOperation[] | null;
}

interface IResGetBlockKramdown {
    id: BlockId;
    kramdown: string;
}

interface IResGetChildBlock {
    id: BlockId;
    type: BlockType;
    subtype?: BlockSubType;
}

interface IResGetTemplates {
    content: string;
    path: string;
}

interface IResReadDirEntry {
    isDir: boolean;
    isSymlink: boolean;
    name: string;
}

type IResReadDir = IResReadDirEntry[];

interface IResExportMdContent {
    hPath: string;
    content: string;
}

interface IResBootProgress {
    progress: number;
    details: string;
}

interface IResForwardProxy {
    body: string;
    contentType: string;
    elapsed: number;
    headers: { [key: string]: string };
    status: number;
    url: string;
}

interface IResExportResources {
    path: string;
}

interface IResRenderAttributeViewColumn {
    id: string;
    name: string;
    type: string;
    icon: string;
    hidden: boolean;
    wrap: boolean;
    pin: boolean;
    width: string;
}

interface IResRenderAttributeView {
    id: string;
    name: string;
    isMirror: boolean;
    view: {
        id: string;
        name: string;
        columns?: IResRenderAttributeViewColumn[];
        fields?: IResRenderAttributeViewColumn[];
    };
}

