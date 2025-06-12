import type { Survey } from "./survey"

export interface Facility {
    whq: string
    location: string
    primaryUse: string
    measurements: MeasurementType
    climate: ClimateType
    congregations: number
    auditoriums: number
    buildings: number

    oldSurvey?: Survey
    newSurvey?: Survey
}

type MeasurementType = 'Metric' | 'Imperial'
type ClimateType =
    "Tropical" |
    "Dry" |
    "Temperate" |
    "Cold" |
    "Coastal"