import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface VertAlignTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className: string;
}

// const VertAlignTextarea = ({
//     className,
//     placeholder,
// }: VertAlignTextareaProps) => {
//     const [text, setText] = useState<string | null>();

//     return (
//         <div
//             contentEditable="true"
//             className={cn(
//                 "flex min-h-0 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//                 className
//             )}
//             onInput={(e) => setText(e.currentTarget.textContent)}
//         >
//             {!text && placeholder}
//             {text}
//         </div>
//     );
// };

// export { VertAlignTextarea };
