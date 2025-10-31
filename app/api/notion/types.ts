export type NotionPlace = {
    object: string;
    id: string;
    created_time: Date;
    last_edited_time: Date;
    created_by: TedBy;
    last_edited_by: TedBy;
    cover: Cover;
    icon: null;
    parent: Parent;
    archived: boolean;
    in_trash: boolean;
    is_locked: boolean;
    properties: Properties;
    url: string;
    public_url: null;
}

export type Cover = {
    type: string;
    external: External;
}

export type External = {
    url: string;
}

export type TedBy = {
    object: string;
    id: string;
}

export type Parent = {
    type: string;
    data_source_id: string;
    database_id: string;
}

export type Properties = {
    Longitude: NumberProp;
    Type: SelectProp;
    "Last edited time": LastEditedTime;
    Latitude: NumberProp;
    Wikipedia: UrlProp;
    Tags: MultiSelectProp;
    Visited: CheckboxProp;
    LocationQuery: RichTextProp;
    Link: UrlProp;
    Name: TitleProp;
}

export type NumberProp = {
    id: string;
    type: "number";
    number: number;
}

export type Select = {
    id: string;
    name: string;
    color: string;
}

export type SelectProp = {
    id: string;
    type: "select";
    select: Select
}

export type LastEditedTime = {
    id: string;
    type: "last_edited_time";
    last_edited_time: string;
}

export type UrlProp = {
    id: string;
    type: "url";
    url: string | null;
}

export type MultiSelectProp = {
    id: string;
    type: "multi_select";
    multi_select: Select[]
}

export type CheckboxProp = {
    id: string;
    type: "checkbox";
    checkbox: boolean;
}

export type Text = { type: "text", text: { content: string, link: null }, plain_text: string }

export type RichTextProp = {
    id: string;
    type: "rich_text";
    "rich_text": Text[]
}

export type TitleProp = {
    id: string;
    type: "title";
    title: Text[]
}

export type Itude = {
    id: string;
    type: string;
    number: number;
}

export type Link = {
    id: string;
    type: string;
    url: null | string;
}

export type LocationQuery = {
    id: string;
    type: string;
    rich_text: RichText[];
}

export type RichText = {
    type: string;
    text: Text;
    annotations: Annotations;
    plain_text: string;
    href: null;
}

export type Annotations = {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
}

export type Visited = {
    id: string;
    type: string;
    checkbox: boolean;
}
