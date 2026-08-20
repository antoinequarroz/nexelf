import type { ImageProps } from "expo-image";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { View } from "react-native";

type ImageFrameBaseProps = Pick<ImageProps, "cachePolicy" | "contentFit" | "contentPosition" | "placeholder" | "priority" | "recyclingKey" | "source"> & {
  aspectRatio: number;
  fallback?: ReactNode;
};

type ImageFrameProps = ImageFrameBaseProps & (
  | { accessibilityLabel: string; decorative?: false }
  | { accessibilityLabel?: never; decorative: true }
);

export function ImageFrame({ source, aspectRatio, accessibilityLabel, cachePolicy = "memory-disk", contentFit = "cover", contentPosition, decorative = false, fallback, placeholder, priority = "normal", recyclingKey }: ImageFrameProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [recyclingKey]);

  return (
    <View className="overflow-hidden rounded-lg bg-raised" style={{ aspectRatio }}>
      {!source || failed ? fallback : (
        <Image
          accessibilityLabel={decorative ? undefined : accessibilityLabel}
          accessible={!decorative}
          cachePolicy={cachePolicy}
          className="h-full w-full"
          contentFit={contentFit}
          contentPosition={contentPosition}
          onError={() => setFailed(true)}
          placeholder={placeholder}
          priority={priority}
          recyclingKey={recyclingKey}
          source={source}
          transition={120}
        />
      )}
    </View>
  );
}
