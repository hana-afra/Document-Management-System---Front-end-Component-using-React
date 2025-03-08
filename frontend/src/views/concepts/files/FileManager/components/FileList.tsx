import { useMemo } from 'react'
import Table from '@/components/ui/Table'
import FileSegment from './FileSegment'
import FileRow from './FileRow'
import type { Files, Layout } from '../types'
import dayjs from 'dayjs'

type FileListProps = {
    fileList: Files
    layout: Layout
    onRename: (id: string) => void
    onDownload: () => void
    onShare: (id: string) => void
    onDelete: (id: string) => void
    onOpen: (id: string) => void
    onClick: (id: string) => void
}

const { TBody, THead, Th, Tr } = Table

const FileList = (props: FileListProps) => {
    const {
        layout,
        fileList,
        onDelete,
        onDownload,
        onShare,
        onRename,
        onOpen,
        onClick,
    } = props

    const folders = useMemo(() => {
        return fileList.filter((file) => file.fileType === 'directory')
    }, [fileList])

    const files = useMemo(() => {
        return fileList.filter((file) => file.fileType !== 'directory')
    }, [fileList])

    

    const renderFileRow = (list: Files, isFolder?: boolean) => (
        <Table className="mt-4">
            <THead>
                <Tr>
                    <Th>File</Th>
                    <Th>Size</Th>
                    <Th>Type</Th>
                    <Th>Created</Th>
                    <Th>Last Modified</Th>
                    <Th>Shared With</Th>
                    <Th>Actions</Th>
                    <Th></Th>
                </Tr>
            </THead>
            <TBody>
                {list.map((file) => (
                    <FileRow
                        key={file.id}
                        fileType={file.fileType || 'unknown'}
                        size={file.size}
                        name={file.name}
                        created={file.uploadDate ? dayjs.unix(file.uploadDate).format('MMM DD, YYYY') : 'N/A'}
                        lastModified={
                            file.activities?.length > 0
                                ? dayjs.unix(file.activities[0].timestamp).format('MMM DD, YYYY')
                                : 'N/A'
                        }
                        sharedWith={
                            file.permissions?.length > 0
                                ? file.permissions.map((user) => user.userName).join(', ')
                                : 'None'
                        }
                        onClick={() => onClick(file.id)}
                        onDownload={onDownload}
                        onShare={() => onShare(file.id)}
                        onDelete={() => onDelete(file.id)}
                        onRename={() => onRename(file.id)}
                        {...(isFolder ? { onOpen: () => onOpen(file.id) } : {})}
                    />
                ))}
            </TBody>
        </Table>
    )

    return (
        <div>
            {files.length > 0 && (
                <div className="mt-8">
                    
                    {layout === 'list' && renderFileRow(files)}
                </div>
            )}
        </div>
    )
}

export default FileList
