import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

// Aucune chaîne de texte en dur, aucune couleur en dur : tout passe par
// i18n et par les tokens de tailwind.config.js.
export default function Accueil() {
  const { t } = useTranslation()

  return (
    <View className="flex-1 justify-center gap-4 px-6">
      <Text className="text-3xl text-encre-950">{t('accueil.titre')}</Text>
      <Text className="text-base text-craie-700">{t('accueil.lead')}</Text>
    </View>
  )
}
