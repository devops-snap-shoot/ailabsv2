export interface MessageFormat {
    id: number;
    user: string;
    message: string;
    reference?: {page_content: string, metadata: any}[];
    isNew: boolean
    removedBy: any[]
    audio?: string
    cache?: any
}