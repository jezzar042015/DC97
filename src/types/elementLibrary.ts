import type { ElementUnit, SurveyCategory } from "./element"

export interface ElementLibrary {
    category: SurveyCategory
    costCode: string
    num: number
    name: string
    component: string
    unit: ElementUnit
    componentId: number
    uniqueKey: string
    tropical?: number | null
    dry?: number | null
    temperate?: number | null
    cold?: number | null
    coastal?: number | null
    active?: number | null
}