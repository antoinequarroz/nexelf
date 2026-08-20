import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { QuietScreen } from "../components/quiet-screen";
import { Chargement } from "../components/etat";
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
      <View className="mb-8 rounded border border-line bg-surface p-4">
        <Text className="font-medium text-ink">{t("habits.createTitle")}</Text>
        <TextInput
          accessibilityLabel={t("habits.name")}
          className="mt-4 min-h-12 rounded border border-line px-3 text-ink"
          placeholder={t("habits.namePlaceholder")}
          placeholderTextColor="#707783"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          accessibilityLabel={t("habits.moment")}
          className="mt-3 min-h-12 rounded border border-line px-3 text-ink"
          placeholder={t("habits.momentPlaceholder")}
          placeholderTextColor="#707783"
          value={moment}
          onChangeText={setMoment}
        />
        <View
          accessibilityRole="radiogroup"
          className="mt-4 flex-row flex-wrap"
        >
          {JOURS_SEMAINE.map((day) => (
            <Pressable
              key={day}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: days.includes(day) }}
              className={`mb-2 mr-2 min-h-11 min-w-11 items-center justify-center rounded border ${days.includes(day) ? "border-lime bg-lime" : "border-line"}`}
              onPress={() => toggleDay(day)}
            >
              <Text
                className={days.includes(day) ? "text-lime-ink" : "text-muted"}
              >
                {t(`habits.days.${day}`)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !name.trim() || !days.length }}
          disabled={!name.trim() || !days.length}
          className="mt-3 min-h-12 items-center justify-center rounded bg-lime disabled:opacity-40"
          onPress={addHabit}
        >
          <Text className="font-semibold text-lime-ink">
            {editing ? t("memory.save") : t("habits.add")}
          </Text>
        </Pressable>
      </View>
      <Text className="mb-3 text-xs uppercase tracking-widest text-subtle">
        {t("habits.today")}
      </Text>
      {!active.length ? (
        <Text className="mb-8 rounded border border-line p-4 leading-5 text-muted">
          {t("habits.empty")}
        </Text>
      ) : (
        active.map((habit) => {
          const done = occurrences?.find(
            (item) => item.habitudeId === habit._id,
          );
          return (
            <View
              key={habit._id}
              className="mb-4 rounded border border-line bg-surface p-4"
            >
              <Text className="font-medium text-ink">{habit.nom}</Text>
              <Text className="mt-1 text-sm text-muted">
                {habit.moment || t("habits.flexible")} ·{" "}
                {habit.jours.map((day) => t(`habits.days.${day}`)).join(" ")}
              </Text>
              {done ? (
                <Text className="mt-3 text-lime">
                  {t(`habits.statuses.${done.statut}`)}
                </Text>
              ) : (
                <View className="mt-3 flex-row flex-wrap">
                  <Pressable
                    accessibilityRole="button"
                    className="mr-4 min-h-11 justify-center"
                    onPress={() =>
                      occurrence({
                        habitudeId: habit._id,
                        date: today,
                        statut: "terminee",
                      })
                    }
                  >
                    <Text className="text-lime">{t("habits.complete")}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className="mr-4 min-h-11 justify-center"
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
                    className="min-h-11 justify-center"
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
                  className="mr-5 min-h-11 justify-center"
                  onPress={() => {
                    setEditing(habit._id);
                    setName(habit.nom);
                    setMoment(habit.moment ?? "");
                    setDays(habit.jours);
                  }}
                >
                  <Text className="text-lime">{t("memory.edit")}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className="mr-5 min-h-11 justify-center"
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
                  className="min-h-11 justify-center"
                  onPress={() =>
                    status({ habitudeId: habit._id, statut: "archivee" })
                  }
                >
                  <Text className="text-danger">{t("habits.archive")}</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
      {active.length ? (
        <View className="mt-5 rounded border border-line p-4">
          <Text className="font-medium text-ink">
            {t("habits.routineTitle")}
          </Text>
          <TextInput
            accessibilityLabel={t("habits.routineName")}
            className="mt-3 min-h-12 rounded border border-line px-3 text-ink"
            value={routineName}
            onChangeText={setRoutineName}
          />
          {active.map((habit) => (
            <Pressable
              key={habit._id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected.includes(habit._id) }}
              className="min-h-11 justify-center"
              onPress={() => toggleHabit(habit._id)}
            >
              <Text
                className={
                  selected.includes(habit._id) ? "text-lime" : "text-muted"
                }
              >
                {selected.includes(habit._id) ? "✓ " : "○ "}
                {habit.nom}
              </Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            disabled={!routineName.trim() || !selected.length}
            className="mt-3 min-h-12 items-center justify-center rounded border border-lime disabled:opacity-40"
            onPress={async () => {
              await createRoutine({ nom: routineName, habitudeIds: selected });
              setRoutineName("");
              setSelected([]);
            }}
          >
            <Text className="text-lime">{t("habits.createRoutine")}</Text>
          </Pressable>
        </View>
      ) : null}
      {routines?.length ? (
        <Text className="mt-5 text-sm text-muted">
          {t("habits.routineCount", { count: routines.length })}
        </Text>
      ) : null}
    </QuietScreen>
  );
}
