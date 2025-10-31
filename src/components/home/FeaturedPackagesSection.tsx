import { PackagesGrid } from "@/components/PackagesGrid";
import type { TravelPackage } from "@/data/packages";

type FeaturedPackagesSectionProps = {
  packages: TravelPackage[];
};

export const FeaturedPackagesSection = ({
  packages,
}: FeaturedPackagesSectionProps) => {
  return <PackagesGrid packages={packages} />;
};
