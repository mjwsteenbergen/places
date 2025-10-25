import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Link = ({
  children,
  className,
  ...props
}: ComponentProps<"a">) => {
  return (
    <a
      {...props}
      className={twMerge(
        "underline hover:text-interactive-hover active:text-interactive-active",
        className
      )}
    >
      {children}
    </a>
  );
};
