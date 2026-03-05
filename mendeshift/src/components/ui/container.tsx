import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-30 md:px-30",
        className,
      )}
      {...props}
    />
  );
}
