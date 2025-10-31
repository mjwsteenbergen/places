import type { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { cva } from "cva";

type BProps = ComponentProps<"button">;
type LinkProps = { href: string } & ComponentProps<"a">;
type Props = BProps | LinkProps;

export const Button = ({ children, ...rest }: PropsWithChildren<Props>) => {
  const [Tag, restProps] =
    "href" in rest
      ? (["a", rest as LinkProps] as const)
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
