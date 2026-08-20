import { useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { QuietScreen } from "../components/quiet-screen";
import { Chargement } from "../components/etat";
import { theme } from "../lib/theme";
import { Badge, Button, Card, Feedback, Field, Section } from "../components/ui";

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
      <Section><Card tone="growth"><View className="flex-row items-center justify-between gap-4">
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
          trackColor={{ false: theme.border, true: theme.progress }}
          thumbColor={theme.surface}
        />
      </View></Card></Section>
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("memory.proposals")}
      </Text>
      {!proposals?.length ? (
        <View className="mb-8"><Feedback message={t("memory.noSilent")} /></View>
      ) : (
        proposals.map((proposal) => (
          <View key={proposal._id} className="mb-5"><Card tone="reflection">
            <Badge label={t(`memory.categories.${proposal.categorie}`)} tone="action" />
            <Text className="mt-2 text-ink">{proposal.contenu}</Text>
            <Text className="mt-2 text-xs text-subtle">
              {t("memory.sourceDate", {
                source: proposal.source,
                date: formatDate(proposal.creeLe),
              })}
            </Text>
            <View className="mt-4 gap-2">
              <Button label={t("memory.confirm")}
                onPress={() =>
                  decide({ propositionId: proposal._id, accepter: true })
                }
              />
              <Button label={t("memory.reject")} variant="secondary"
                onPress={() =>
                  decide({ propositionId: proposal._id, accepter: false })
                }
              />
            </View>
          </Card></View>
        ))
      )}
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("memory.saved")}
      </Text>
      {!memories?.length ? (
        <Feedback message={t("memory.empty")} />
      ) : (
        memories.map((memory) => (
          <View key={memory._id} className="mb-5"><Card>
            <Badge label={t(`memory.categories.${memory.categorie}`)} />
            {editing === memory._id ? (
              <View className="mt-3"><Field
                label={t("memory.editLabel")}
                value={content}
                onChangeText={setContent}
              /></View>
            ) : (
              <Text className="mt-2 text-ink">{memory.contenu}</Text>
            )}
            <Text className="mt-2 text-xs text-subtle">
              {t("memory.sourceDate", {
                source: memory.source,
                date: formatDate(memory.creeLe),
              })}
            </Text>
            <View className="mt-4 gap-2">
              {editing === memory._id ? (
                <Button label={t("memory.save")} variant="secondary"
                  onPress={async () => {
                    await correct({ souvenirId: memory._id, contenu: content });
                    setEditing(undefined);
                  }}
                />
              ) : (
                <Button label={t("memory.edit")} variant="secondary"
                  onPress={() => {
                    setEditing(memory._id);
                    setContent(memory.contenu);
                  }}
                />
              )}
              <Button label={t("memory.delete")} variant="destructive" onPress={() => confirmDelete(memory._id)} />
            </View>
          </Card></View>
        ))
      )}
    </QuietScreen>
  );
}
