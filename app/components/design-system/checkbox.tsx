import * as RCheckbox from "@radix-ui/react-checkbox";
import { Check } from "iconoir-react";

type Props = Pick<
  RCheckbox.CheckboxProps,
  "defaultChecked" | "checked" | "onCheckedChange"
> & {
  classname?: string;
};

export const Checkbox = ({ classname, ...rest }: Props) => {
  return (
    <>
      <RCheckbox.Root
        className={
          "reset border-2 border-neutral-border-high p-1 flex justify-center items-stretch " +
          (classname ?? "h-10 w-10")
        }
        {...rest}
      >
        <RCheckbox.Indicator className="CheckboxIndicator">
          <Check strokeWidth={"2px"} className="w-full h-full" />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
    </>
  );
};

export default Checkbox;
