import type { ImageProps } from "expo-image";
import { Image } from "expo-image";
import { useState } from "react";
import { View } from "react-native";

type ImageFrameBaseProps = Pick<ImageProps, "source" | "contentFit" | "placeholder"> & {
  aspectRatio: number;
  fallbackSource?: ImageProps["source"];
};

type ImageFrameProps = ImageFrameBaseProps & (
  | { accessibilityLabel: string; decorative?: false }
  | { accessibilityLabel?: never; decorative: true }
);

export function ImageFrame({ source, fallbackSource, aspectRatio, accessibilityLabel, decorative = false, contentFit = "cover", placeholder }: ImageFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <View className="overflow-hidden rounded-lg bg-raised" style={{ aspectRatio }}>
      <Image
        accessibilityLabel={decorative ? undefined : accessibilityLabel}
        accessible={!decorative}
        className="h-full w-full"
        contentFit={contentFit}
        onError={() => setFailed(true)}
        placeholder={placeholder}
        source={failed && fallbackSource ? fallbackSource : source}
        transition={0}
      />
    </View>
  );
}
