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
  const alignment =
    align === "center"
      ? "text-center md:mx-auto md:max-w-3xl"
      : "text-left";

  return (
    <header className={`space-y-4 ${alignment} mb-6 md:mb-8`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2>{title}</h2>
      {description ? (
        <p className="text-balance text-base text-foreground-muted md:text-lg lg:text-xl md:mx-auto md:max-w-3xl">
          {description}
        </p>
      ) : null}
    </header>
  );
};
