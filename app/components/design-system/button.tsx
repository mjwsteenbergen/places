import type { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "radix-ui";

type BProps = ComponentProps<"button">;
type AsChildProps = { asChild: true; className?: string };
type Props = BProps | AsChildProps;

export const Button = ({ children, ...rest }: PropsWithChildren<Props>) => {
  const [Tag, restProps] =
    "asChild" in rest
      ? ([Slot.Root, rest as AsChildProps] as const)
      : (["button", rest as BProps] as const);
  return (
    <Tag
      {...restProps}
      className={twMerge(
        [
          "block text-center",
          "bg-primary-interactive-default disabled:grayscale-75 not-disabled:hover:bg-primary-interactive-hover not-disabled:active:bg-primary-interactive-active",
          "text-neutral-text-dark-onbackground",
          "px-5 py-3 rounded",
          "shadow active:shadow-none",
        ],
        rest.className
      )}
    >
      {children}
    </Tag>
  );
};
