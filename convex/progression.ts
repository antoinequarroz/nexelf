import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

type Compteurs = { terminees: number; reportees: number; abandonnees: number; total: number; objectifsTermines: number; etapesObjectifs: number; joursDocumentes: number }

function dansPeriode(date: string, debut: string, fin: string) { return date >= debut && date <= fin }

function compter(actions: { statut: string }[]): Pick<Compteurs, 'terminees' | 'reportees' | 'abandonnees' | 'total'> {
  return {
    terminees: actions.filter(a => a.statut === 'terminee').length,
    reportees: actions.filter(a => a.statut === 'reportee').length,
    abandonnees: actions.filter(a => a.statut === 'ignoree').length,
    total: actions.length,
  }
}

export const bilanHebdomadaire = query({
  args: { debut: v.string(), fin: v.string(), debutPrecedent: v.string(), finPrecedent: v.string() },
  handler: async (ctx, periode) => {
    const profil = await exigerProfil(ctx)
    const [journees, actions, objectifs, etapes, retours] = await Promise.all([
      ctx.db.query('journees').withIndex('by_profil_and_date', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('actionsQuotidiennes').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('objectifs').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('etapesObjectif').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('retoursInsightsProgression').withIndex('by_profil_and_insight', q => q.eq('profilId', profil._id)).collect(),
    ])
    const dates = new Map(journees.map(j => [j._id, j.date]))
    const pour = (debut: string, fin: string): Compteurs => {
      const selection = actions.filter(a => { const date = dates.get(a.journeeId); return date !== undefined && dansPeriode(date, debut, fin) })
      const joursDocumentes = new Set(selection.map(a => dates.get(a.journeeId))).size
      return { ...compter(selection), joursDocumentes,
        objectifsTermines: objectifs.filter(o => o.supprimeLe === undefined && o.statut === 'actif').filter(o => etapes.some(e => e.objectifId === o._id && e.termineeLe !== undefined && e.termineeLe >= Date.parse(`${debut}T00:00:00Z`) && e.termineeLe <= Date.parse(`${fin}T23:59:59Z`))).length,
        etapesObjectifs: etapes.filter(e => e.termineeLe !== undefined && e.termineeLe >= Date.parse(`${debut}T00:00:00Z`) && e.termineeLe <= Date.parse(`${fin}T23:59:59Z`)).length,
      }
    }
    const actuel = pour(periode.debut, periode.fin)
    const precedent = pour(periode.debutPrecedent, periode.finPrecedent)
    const hypotheses: { id: string; type: string; sources: { cle: string; valeur: number }[] }[] = []
    if (actuel.joursDocumentes >= 2 && actuel.total >= 3 && actuel.terminees / actuel.total >= .7) hypotheses.push({ id: 'regularite-haute', type: 'regularite', sources: [{ cle: 'terminees', valeur: actuel.terminees }, { cle: 'total', valeur: actuel.total }] })
    if (actuel.joursDocumentes >= 2 && actuel.reportees >= 2 && actuel.reportees > actuel.terminees / 2) hypotheses.push({ id: 'reports-frequents', type: 'reports', sources: [{ cle: 'reportees', valeur: actuel.reportees }, { cle: 'terminees', valeur: actuel.terminees }] })
    if (actuel.joursDocumentes >= 2 && actuel.objectifsTermines > precedent.objectifsTermines) hypotheses.push({ id: 'objectifs-progressent', type: 'objectifs', sources: [{ cle: 'objectifsTermines', valeur: actuel.objectifsTermines }, { cle: 'objectifsPrecedents', valeur: precedent.objectifsTermines }] })
    const ignores = new Set(retours.filter(r => r.semaine === periode.debut).map(r => r.insightId))
    return { periode: { debut: periode.debut, fin: periode.fin }, actuel, precedent, hypotheses: hypotheses.filter(h => !ignores.has(h.id)).slice(0, 3), minimumJours: 2 }
  }
})

export const evaluerInsight = mutation({
  args: { insightId: v.string(), semaine: v.string(), retour: v.union(v.literal('faux'), v.literal('inutile')) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const existant = await ctx.db.query('retoursInsightsProgression').withIndex('by_profil_and_insight', q => q.eq('profilId', profil._id).eq('insightId', args.insightId)).unique()
    if (existant) { await ctx.db.patch(existant._id, { semaine: args.semaine, retour: args.retour, misAJourLe: Date.now() }); return existant._id }
    return ctx.db.insert('retoursInsightsProgression', { profilId: profil._id, ...args, misAJourLe: Date.now() })
  }
})
