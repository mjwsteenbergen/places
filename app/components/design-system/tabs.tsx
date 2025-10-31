import type { ComponentProps } from "react";
import { Tabs as Root } from "radix-ui";
import { twMerge } from "tailwind-merge";

export const Tabs = ({
  className,
  ...props
}: ComponentProps<typeof Root.Root>) => {
  return <Root.Root {...props} className={twMerge("w-full", className)} />;
};

export const TabTriggerList = ({
  className,
  ...props
}: ComponentProps<typeof Root.List>) => {
  return (
    <Root.List
      {...props}
      className={twMerge("w-full grid grid-flow-col", className)}
    />
  );
};

export const TabTrigger = ({
  className,
  ...props
}: ComponentProps<typeof Root.Trigger>) => {
  return (
    <Root.Trigger
      {...props}
      className={twMerge(
        "border-b-2 border-b-primary-border-low data-[state=active]:bg-primary-low hover:bg-primary-interactive-hover px-4 py-2",
        className
      )}
    />
  );
};

export const TabContent = ({
  className,
  ...props
}: ComponentProps<typeof Root.Content>) => {
  return <Root.Content {...props} className={twMerge("", className)} />;
};
