import HeroHeading from "./HeroHeading";
import HeroSubtitle from "./HeroSubtitle";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`text-center max-w-4xl mx-auto mb-16 ${className}`}>
      <HeroHeading size="md" className="mb-4">
        {title}
      </HeroHeading>

      <HeroSubtitle size="sm" className="max-w-3xl">
        {subtitle}
      </HeroSubtitle>
    </div>
  );
}
