import type { NotionPlace } from "./types";

type NumberProp = {
    id: string;
    type: "number";
    number: number;
}

type SelectProp = {
    id: string;
    type: "select";
    select: {
        id: string;
        name: string;
        color: string;
    }
}

type LastEditedTime = {
    id: string;
    type: "last_edited_time";
    last_edited_time: string;
}

type UrlProp = {
    id: string;
    type: "url";
    url: string | null;
}

type MultiSelectProp = {
    id: string;
    type: "multi_select";
    multi_select: {
        id: string;
        name: string;
        color: string;
    }[]
}

type CheckboxProp = {
    id: string;
    type: "checkbox";
    checkbox: boolean;
}

type Text = { type: "text", text: { content: string, link: null }, plain_text: string }

type RichTextProp = {
    id: string;
    type: "rich_text";
    "rich_text": Text[]
}

type TitleProp = {
    id: string;
    type: "title";
    title: Text[]
}

type Props = TitleProp | RichTextProp | CheckboxProp | MultiSelectProp | UrlProp | LastEditedTime | SelectProp | NumberProp;

const mapProp = (some: Props) => {
    switch (some.type) {
        case "checkbox":
            return some.checkbox;
        case "last_edited_time":
            return some.last_edited_time;
        case "multi_select":
            return some.multi_select.map(i => i.name);
        case "number":
            return some.number;
        case "select":
            return some.select.name;
        case "rich_text":
            return some.rich_text.map(i => i.plain_text).join(". ")
        case "title":
            return some.title.map(i => i.plain_text).join(". ")
        case "url":
            return some.url;
    }
}

export const normalizer = (notionPlace: NotionPlace) => {
    notionPlace.properties["Last edited time"]

    return {
        ...notionPlace,
        props: {
            ...Object.fromEntries(Object.entries(notionPlace.properties).map(i => [i[0], mapProp(i[1] as any)]))
        }
    }
}