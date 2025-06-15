import type { ConditionNumber } from "./element"

export interface ElementSurvey {
    srcRow: number
    whq: string
    categoryGroup: string
    surveyKey: string
    key: string
    qty: number | null
    lastYear: number | null
    condition: ConditionNumber | null
    remainingYears: number
    adjRemainingYears: number | null
    information: string | null
}