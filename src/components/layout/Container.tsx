interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
  id?: string;
  "aria-label"?: string;
}

export function Container({
  children,
  className = "",
  as: Tag = "div",
  id,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={`mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
