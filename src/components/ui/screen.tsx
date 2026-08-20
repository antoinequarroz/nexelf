import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = PropsWithChildren<{
  keyboard?: boolean;
  scroll?: boolean;
  centered?: boolean;
  contentClassName?: string;
}>;

export function Screen({ children, keyboard = false, scroll = true, centered = false, contentClassName = "" }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={`${centered ? "flex-grow justify-center" : ""} px-6 pb-12 pt-8 ${contentClassName}`}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 px-6 pb-12 pt-8 ${centered ? "justify-center" : ""} ${contentClassName}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "right", "bottom", "left"]}>
      {keyboard ? (
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {content}
        </KeyboardAvoidingView>
      ) : content}
    </SafeAreaView>
  );
}
