type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) => {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <header className={`space-y-3 ${alignment}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deepgreen">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold text-slate md:text-3xl">{title}</h2>
      {description ? (
        <p className="text-base text-foreground-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
};
