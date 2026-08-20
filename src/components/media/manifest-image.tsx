import { PixelRatio, useWindowDimensions, View } from "react-native";
import { ImageFrame } from "../ui/image-frame";
import { getMediaLayout, resolveMedia } from "../../lib/media/registry";
import { bundledMediaSources } from "../../lib/media/bundled-sources";

type ManifestImageProps = {
  assetId: string;
  aboveFold?: boolean;
};

function BrandFallback() {
  return (
    <View accessibilityElementsHidden className="h-full w-full bg-reflection" importantForAccessibility="no-hide-descendants">
      <View className="absolute -left-8 bottom-10 h-24 w-24 rounded-full bg-impulse" />
      <View className="absolute bottom-16 left-12 h-1 w-2/3 -rotate-6 rounded-full bg-progress" />
      <View className="absolute bottom-12 right-10 h-5 w-5 rounded-full bg-progress" />
    </View>
  );
}

export function ManifestImage({ assetId, aboveFold = false }: ManifestImageProps) {
  const { width } = useWindowDimensions();
  const renderedWidth = Math.max(1, width - 48);
  const resolution = resolveMedia(assetId, renderedWidth, PixelRatio.get(), new Date(), bundledMediaSources);
  const layout = getMediaLayout(assetId);
  const accessibilityLabel = resolution.asset?.decorative === false ? resolution.asset.altFr : null;
  const frameProps = {
    aspectRatio: layout.aspectRatio,
    contentPosition: { left: `${layout.focalPoint.x * 100}%`, top: `${layout.focalPoint.y * 100}%` },
    fallback: <BrandFallback />,
    placeholder: { blurhash: "L9PZp9~q00%M_3t7RjRj00IU?bIU" },
    priority: aboveFold ? "high" as const : "low" as const,
    recyclingKey: resolution.cacheKey ?? `fallback:${assetId}:${resolution.availability}`,
    source: resolution.source ?? undefined,
  };

  if (accessibilityLabel) return <ImageFrame {...frameProps} accessibilityLabel={accessibilityLabel} />;
  return <ImageFrame {...frameProps} decorative />;
}
