import type { ConditionNumber, Element } from "./element"

export interface ElementSurvey {
    srcRow: number
    whq: string
    categoryGroup: string
    surveyKey: string
    key: string
    element?: Element
    qty: number | null
    lastYear: number | null
    condition: ConditionNumber | null
    remainingYears: number
    adjRemainingYears: number | null
    information: string | null
}