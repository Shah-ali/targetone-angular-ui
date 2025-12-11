export interface Template {
    name: string;
    createdUser: string;
    createdDateUi: string;
    source: string;
    desc: string;
    imagePath: string;
    dbKey: number;
    tagsForUi: Tags[];
}

export interface Tags {
    dbKey: number;
    tagName: string;
    tagColorCode: string;
}