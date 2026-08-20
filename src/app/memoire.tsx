import { useState } from "react";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { QuietScreen } from "../components/quiet-screen";
import { Chargement } from "../components/etat";
import { theme } from "../lib/theme";

export default function Memoire() {
  const { t, i18n } = useTranslation();
  const profile = useQuery(api.profils.courant);
  const memories = useQuery(api.memoire.lister);
  const proposals = useQuery(api.memoire.propositions);
  const decide = useMutation(api.memoire.decider);
  const remove = useMutation(api.memoire.supprimer);
  const correct = useMutation(api.memoire.corriger);
  const updatePreferences = useMutation(api.profils.mettreAJourPreferences);
  const [editing, setEditing] = useState<Id<"souvenirs">>();
  const [content, setContent] = useState("");
  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(
      timestamp,
    );

  function confirmDelete(id: Id<"souvenirs">) {
    Alert.alert(t("memory.deleteTitle"), t("memory.deleteBody"), [
      { text: t("memory.cancel"), style: "cancel" },
      {
        text: t("memory.delete"),
        style: "destructive",
        onPress: () => void remove({ souvenirId: id }),
      },
    ]);
  }

  if (
    profile === undefined ||
    memories === undefined ||
    proposals === undefined
  )
    return <Chargement />;

  return (
    <QuietScreen
      title={t("memory.title")}
      description={t("memory.description")}
    >
      <View className="mb-8 flex-row items-center justify-between rounded border border-line bg-surface p-4">
        <View className="mr-4 flex-1">
          <Text className="font-medium text-ink">{t("memory.enabled")}</Text>
          <Text className="mt-1 text-sm text-muted">
            {t("memory.enabledBody")}
          </Text>
        </View>
        <Switch
          accessibilityLabel={t("memory.enabled")}
          value={profile?.memoireActive ?? false}
          disabled={!profile}
          onValueChange={(memoireActive) => {
            void updatePreferences({ memoireActive });
          }}
          trackColor={{ false: theme.border, true: theme.lime }}
          thumbColor={theme.text}
        />
      </View>
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("memory.proposals")}
      </Text>
      {!proposals?.length ? (
        <Text className="mb-8 rounded border border-line p-4 leading-5 text-muted">
          {t("memory.noSilent")}
        </Text>
      ) : (
        proposals.map((proposal) => (
          <View
            key={proposal._id}
            className="mb-4 rounded border border-lime bg-surface p-4"
          >
            <Text className="text-xs uppercase tracking-widest text-lime">
              {t(`memory.categories.${proposal.categorie}`)}
            </Text>
            <Text className="mt-2 text-ink">{proposal.contenu}</Text>
            <Text className="mt-2 text-xs text-subtle">
              {t("memory.sourceDate", {
                source: proposal.source,
                date: formatDate(proposal.creeLe),
              })}
            </Text>
            <View className="mt-4 flex-row">
              <Pressable
                accessibilityRole="button"
                className="mr-3 min-h-11 flex-1 items-center justify-center rounded bg-lime"
                onPress={() =>
                  decide({ propositionId: proposal._id, accepter: true })
                }
              >
                <Text className="font-semibold text-lime-ink">
                  {t("memory.confirm")}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="min-h-11 flex-1 items-center justify-center rounded border border-line"
                onPress={() =>
                  decide({ propositionId: proposal._id, accepter: false })
                }
              >
                <Text className="text-ink">{t("memory.reject")}</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("memory.saved")}
      </Text>
      {!memories?.length ? (
        <Text className="rounded border border-line p-4 text-muted">
          {t("memory.empty")}
        </Text>
      ) : (
        memories.map((memory) => (
          <View
            key={memory._id}
            className="mb-4 rounded border border-line bg-surface p-4"
          >
            <Text className="text-xs uppercase tracking-widest text-subtle">
              {t(`memory.categories.${memory.categorie}`)}
            </Text>
            {editing === memory._id ? (
              <TextInput
                accessibilityLabel={t("memory.editLabel")}
                className="mt-3 min-h-14 rounded border border-line p-3 text-ink"
                value={content}
                onChangeText={setContent}
              />
            ) : (
              <Text className="mt-2 text-ink">{memory.contenu}</Text>
            )}
            <Text className="mt-2 text-xs text-subtle">
              {t("memory.sourceDate", {
                source: memory.source,
                date: formatDate(memory.creeLe),
              })}
            </Text>
            <View className="mt-3 flex-row">
              {editing === memory._id ? (
                <Pressable
                  accessibilityRole="button"
                  className="mr-5 min-h-11 justify-center"
                  onPress={async () => {
                    await correct({ souvenirId: memory._id, contenu: content });
                    setEditing(undefined);
                  }}
                >
                  <Text className="text-lime">{t("memory.save")}</Text>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  className="mr-5 min-h-11 justify-center"
                  onPress={() => {
                    setEditing(memory._id);
                    setContent(memory.contenu);
                  }}
                >
                  <Text className="text-lime">{t("memory.edit")}</Text>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                className="min-h-11 justify-center"
                onPress={() => confirmDelete(memory._id)}
              >
                <Text className="text-danger">{t("memory.delete")}</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </QuietScreen>
  );
}
