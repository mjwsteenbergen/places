import { Check } from "iconoir-react";

type Props = {
    name: string;
    href?: string;
    checked?: boolean;
    onClicked?: React.MouseEventHandler<HTMLLIElement>
}

export const Badge = ({ name, href,onClicked, checked }: Props) => {
    let li = <li onClick={onClicked} className={"reset bg-red-500 rounded-full text-white flex flex-nowrap gap-1 text-xs py-2 px-4 font-bold list-none whitespace-nowrap self-start" + (onClicked ? " cursor-pointer" : "")}>
        {checked ? <Check/> : <></>}
        {name}
    </li>;

    if (href) {
        return <a href={href} className='reset' target="_blank">
            {li}
        </a>
    }

    return li;
}