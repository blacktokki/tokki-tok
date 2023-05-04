export type Board = {
    id?: number,
    title:string,
    content: string,
}

export type EditBoard = Board & {
    channel:number
    user?:number
}

type Link = {
    url:string,
    title:string,
    description:string,
    image:string,
}

export type BoardContent = {
    id: number,
    board_set:Board[],
    link_set:Link[],
    user: number,
    channel: number
    created: string,
    updated: string,
    name: string
}