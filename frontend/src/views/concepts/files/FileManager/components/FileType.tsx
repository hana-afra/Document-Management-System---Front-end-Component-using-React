const getFileType = (type: string) => {
    switch (type) {
        case 'pdf':
            return 'PDF'
        case 'xls':
            return 'XLS'
        case 'doc':
            return 'DOC'
        case 'ppt':
            return 'PPT'
        case 'figma':
            return 'Figma'
        case 'image/jpeg':
            return 'JPEG'
        case 'text/plain':  // ✅ Add support for plain text files
            return 'TXT';
        case 'directory':
            return 'Folder'
        default:
            return <></>
    }
}

const FileType = ({ type }: { type: string }) => {
    return <>{getFileType(type)}</>
}

export default FileType
