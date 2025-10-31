import type { PropsWithChildren } from "react";
import { cva, type VariantProps } from "cva";

const tag = cva({
  base: "block px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap",
  variants: {
    filled: {
      true: "bg-primary-low",
      false: "bg-neutral-default",
    },
  },
  defaultVariants: {
    filled: false,
  },
});

export const Tag = ({
  children,
  filled,
}: PropsWithChildren<VariantProps<typeof tag>>) => {
  return <div className={tag({ filled })}>{children}</div>;
};
