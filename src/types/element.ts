import type { ElementSurvey } from "./elementSurvey"

export interface Element {
    buidlingWhq: string
    componentId: number
    category: string
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

type ElementUnit = 'A' | 'L' | 'N'
export type ConditionNumber = 1 | 2 | 3 | 4 