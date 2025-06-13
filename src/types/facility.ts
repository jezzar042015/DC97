
export interface Facility {
    whq: string
    location: string
    primaryUse: string
    measurements: MeasurementType
    climate: ClimateType
    congregations: number
    auditoriums: number
    buildings: number
}

type MeasurementType = 'Metric' | 'Imperial'
type ClimateType =
    "Tropical" |
    "Dry" |
    "Temperate" |
    "Cold" |
    "Coastal"