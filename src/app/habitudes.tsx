import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { QuietScreen } from "../components/quiet-screen";
import { Chargement } from "../components/etat";
import { Badge, Button, Card, Choice, ChoiceGroup, Feedback, Field, Section } from "../components/ui";
import {
  dateLocale,
  JOURS_SEMAINE,
  lendemain,
  normaliserJours,
} from "../lib/habitudes";

export default function Habitudes() {
  const { t } = useTranslation();
  const habits = useQuery(api.habitudes.lister);
  const routines = useQuery(api.habitudes.listerRoutines);
  const today = dateLocale();
  const occurrences = useQuery(api.habitudes.occurrencesDuJour, {
    date: today,
  });
  const create = useMutation(api.habitudes.creer);
  const update = useMutation(api.habitudes.modifier);
  const status = useMutation(api.habitudes.changerStatut);
  const occurrence = useMutation(api.habitudes.changerOccurrence);
  const createRoutine = useMutation(api.habitudes.creerRoutine);
  const [name, setName] = useState("");
  const [moment, setMoment] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [selected, setSelected] = useState<Id<"habitudes">[]>([]);
  const [editing, setEditing] = useState<Id<"habitudes">>();
  const active = habits?.filter((habit) => habit.statut !== "archivee") ?? [];

  async function addHabit() {
    if (!name.trim() || !days.length) return;
    const values = {
      nom: name,
      jours: normaliserJours(days),
      moment: moment.trim() || undefined,
    };
    if (editing) await update({ habitudeId: editing, ...values });
    else await create(values);
    setName("");
    setMoment("");
    setDays([]);
    setEditing(undefined);
  }
  function toggleDay(day: number) {
    setDays((value) =>
      value.includes(day)
        ? value.filter((item) => item !== day)
        : [...value, day],
    );
  }
  function toggleHabit(id: Id<"habitudes">) {
    setSelected((value) =>
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    );
  }

  if (
    habits === undefined ||
    routines === undefined ||
    occurrences === undefined
  )
    return <Chargement />;

  return (
    <QuietScreen
      title={t("habits.title")}
      description={t("habits.description")}
    >
      <Section><Card tone="growth">
        <Text className="font-medium text-ink">{t("habits.createTitle")}</Text>
        <View className="mt-4"><Field
          label={t("habits.name")}
          placeholder={t("habits.namePlaceholder")}
          value={name}
          onChangeText={setName}
        /></View>
        <Field
          label={t("habits.moment")}
          placeholder={t("habits.momentPlaceholder")}
          value={moment}
          onChangeText={setMoment}
        />
        <ChoiceGroup>
          {JOURS_SEMAINE.map((day) => (
            <Choice
              key={day}
              label={t(`habits.days.${day}`)}
              selected={days.includes(day)}
              onPress={() => toggleDay(day)}
            />
          ))}
        </ChoiceGroup>
        <View className="mt-4"><Button
          disabled={!name.trim() || !days.length}
          label={editing ? t("memory.save") : t("habits.add")}
          onPress={addHabit}
        /></View>
      </Card></Section>
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("habits.today")}
      </Text>
      {!active.length ? (
        <View className="mb-8"><Feedback message={t("habits.empty")} /></View>
      ) : (
        active.map((habit) => {
          const done = occurrences?.find(
            (item) => item.habitudeId === habit._id,
          );
          return (
            <View key={habit._id} className="mb-5"><Card>
              <Text className="font-medium text-ink">{habit.nom}</Text>
              <Text className="mt-1 text-sm text-muted">
                {habit.moment || t("habits.flexible")} ·{" "}
                {habit.jours.map((day) => t(`habits.days.${day}`)).join(" ")}
              </Text>
              {done ? (
                <View className="mt-3"><Badge label={t(`habits.statuses.${done.statut}`)} tone="success" /></View>
              ) : (
                <View className="mt-3 flex-row flex-wrap">
                  <Pressable
                    accessibilityRole="button"
                    className="mr-4 min-h-touch justify-center"
                    onPress={() =>
                      occurrence({
                        habitudeId: habit._id,
                        date: today,
                        statut: "terminee",
                      })
                    }
                  >
                    <Text className="text-progress">{t("habits.complete")}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className="mr-4 min-h-touch justify-center"
                    onPress={() =>
                      occurrence({
                        habitudeId: habit._id,
                        date: today,
                        statut: "ignoree",
                      })
                    }
                  >
                    <Text className="text-muted">{t("habits.skip")}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-touch justify-center"
                    onPress={() =>
                      occurrence({
                        habitudeId: habit._id,
                        date: today,
                        statut: "reportee",
                        reporteeAu: lendemain(today),
                      })
                    }
                  >
                    <Text className="text-muted">{t("habits.postpone")}</Text>
                  </Pressable>
                </View>
              )}
              <View className="mt-2 flex-row">
                <Pressable
                  accessibilityRole="button"
                  className="mr-5 min-h-touch justify-center"
                  onPress={() => {
                    setEditing(habit._id);
                    setName(habit.nom);
                    setMoment(habit.moment ?? "");
                    setDays(habit.jours);
                  }}
                >
                  <Text className="text-action">{t("memory.edit")}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className="mr-5 min-h-touch justify-center"
                  onPress={() =>
                    status({
                      habitudeId: habit._id,
                      statut: habit.statut === "pause" ? "active" : "pause",
                    })
                  }
                >
                  <Text className="text-subtle">
                    {habit.statut === "pause"
                      ? t("habits.resume")
                      : t("habits.pause")}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className="min-h-touch justify-center"
                  onPress={() =>
                    status({ habitudeId: habit._id, statut: "archivee" })
                  }
                >
                  <Text className="text-danger">{t("habits.archive")}</Text>
                </Pressable>
              </View>
            </Card></View>
          );
        })
      )}
      {active.length ? (
        <View className="mt-5"><Card tone="reflection">
          <Text className="font-medium text-ink">
            {t("habits.routineTitle")}
          </Text>
          <View className="mt-3"><Field
            label={t("habits.routineName")}
            value={routineName}
            onChangeText={setRoutineName}
          /></View>
          {active.map((habit) => (
            <Pressable
              key={habit._id}
              accessibilityLabel={habit.nom}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected.includes(habit._id) }}
              className="min-h-touch justify-center"
              onPress={() => toggleHabit(habit._id)}
            >
              <Text
                className={
                  selected.includes(habit._id) ? "text-action" : "text-muted"
                }
              >
                {selected.includes(habit._id) ? "✓ " : "○ "}
                {habit.nom}
              </Text>
            </Pressable>
          ))}
          <Button
            disabled={!routineName.trim() || !selected.length}
            label={t("habits.createRoutine")}
            variant="secondary"
            onPress={async () => {
              await createRoutine({ nom: routineName, habitudeIds: selected });
              setRoutineName("");
              setSelected([]);
            }}
          />
        </Card></View>
      ) : null}
      {routines?.length ? (
        <Text className="mt-5 text-sm text-muted">
          {t("habits.routineCount", { count: routines.length })}
        </Text>
      ) : null}
    </QuietScreen>
  );
}
