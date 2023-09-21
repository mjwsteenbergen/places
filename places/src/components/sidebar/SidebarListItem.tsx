import { Camera, Clutery, PinAlt, Suggestion, QuestionMark, Building, City } from "iconoir-react";
import { ReactNode } from "react";
import { BasicPlace } from "../../endpoint";

const map: Record<BasicPlace['Type'], ReactNode> = {
    "Place to visit": <Camera />,
    "Place to Eat": <Clutery />,
    "Vacation Highlight": <PinAlt />,
    "Experience": <PinAlt/>,
    "City": <City/>,
    "Museum": <Building/>,
    "Point of interest": <Camera />,
    "WikipediaPlace": <Camera />,
    "unknown": <QuestionMark />
};

export const SidebarListItem = ({ place, onClick }: SidebarItem2Props) => {
    return <li className="bg-white dark:bg-black-900 max-w-lg px-5 cursor-pointer" onClick={onClick}>
        <h4 className="flex gap-2 text-ellipsis">{map[place.Type] ?? map['unknown']} {place.Name}</h4>
    </li>
}

type SidebarItem2Props = {
    place: BasicPlace;
    onClick: () => void;
}