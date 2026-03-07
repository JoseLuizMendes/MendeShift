import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-30",
        className,
      )}
      {...props}
    />
  );
}
