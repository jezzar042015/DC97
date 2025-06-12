import type { ElementSurvey } from "./elementSurvey"

export interface Element {
    whq: string
    componentId: number
    category: SurveyCategory
    costCode: string
    num: number
    uniqueKey: string //num_component
    name: string
    component: string
    unit: ElementUnit
    qtyUnit: string
    oldSurvey?: ElementSurvey
    newSurvey?: ElementSurvey
}

export type ElementUnit = 'A' | 'L' | 'N'
export type ConditionNumber = 1 | 2 | 3 | 4
export type SurveyCategory = 'Site' | 'Building' | 'Level' 