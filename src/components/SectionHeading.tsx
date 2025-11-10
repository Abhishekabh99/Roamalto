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
      ? "mx-auto text-center"
      : "text-left";
  const descriptionAlignment =
    align === "center" ? "mx-auto" : "ml-0";

  return (
    <header className={`mb-6 flex w-full flex-col gap-4 md:mb-8 ${alignment}`}>
      {eyebrow ? (
        <p className="text-[clamp(0.75rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.2em] text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="heading-2">{title}</h2>
      {description ? (
        <p
          className={`body-text text-foreground-muted text-balance max-w-prose ${descriptionAlignment}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
};
