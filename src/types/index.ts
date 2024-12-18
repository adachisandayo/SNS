export type Posts = {
    id: number;
    message: string;
    user_id: number;
    post_datetime: string;
    user_tag: string;
    user_name: string;
    reaction_count: number;
    user_reacted: boolean;
}

export type User = {
    id: number;
    user_tag: string;
    user_name: string;
}