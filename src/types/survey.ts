import type { ElementSurvey } from "./elementSurvey"

export interface Survey {
    whq: string
    date: string
    year: number
    uniqueKey: string //whq_date
    elements: ElementSurvey[]
    description?: string
}