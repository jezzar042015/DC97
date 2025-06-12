import type { ConditionNumber, Element } from "./element"

export interface ElementSurvey {
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