export type Posts = {
    id: number;
    message: string;
    user_id: number;
    post_datetime: string;
    user_tag: string;
}

export type User = {
    id: number;
    user_tag: string;
    user_name: string;
}