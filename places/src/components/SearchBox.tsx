import { usePageState } from "../context/page-state";
import { cachedApi, getAuth } from "../endpoint";
import { Cancel, NavArrowDown, PinAlt } from 'iconoir-react';

type SearchBoxProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    searchForLocalPlaces: () => void;
    onExpandClick: () => void;
    expanded: boolean;
    showingLocalPlaces: boolean;
    resetLocalPlaces: () => void;
};


export const SearchBox = ({ onChange, searchForLocalPlaces, onExpandClick, expanded, showingLocalPlaces, resetLocalPlaces }: SearchBoxProps) => {
    const { attractionFilter: filter, setAttractionFilter: setFilter } = usePageState();
    return <div className={"pointer-events-auto rounded-lg p-4 bg-white flex items-center gap-2"}>

        <input type="text" className="bg-white grow w-43" placeholder="Which place?" onChange={onChange} value={filter?.attraction ?? ""} />
        {getAuth().token && <button className="text-xs p-3" onClick={searchForLocalPlaces}><PinAlt /></button>}
        {showingLocalPlaces && <button className="text-xs p-3" onClick={resetLocalPlaces}><Cancel /></button>}
        <button className={"text-xs p-3"} onClick={onExpandClick}><NavArrowDown className={"transition-all" + (expanded ? " rotate-180" : "")} /></button>
    </div>;
};
