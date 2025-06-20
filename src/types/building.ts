export interface Building {
    facilityWhq: string
    whq: string
    name: string
    levels: number
    occupancy: OccupancyType
    gfa: number
    construction: number
    renMajYear: number | null
    maintenance: MaintenanceCondition
    building: BuildingCondition
    projRenYear: number
}

type OccupancyType =
    "Educational" |
    "Health Care" |
    "Meeting Place" |
    "Office" |
    "Parking" |
    "Production" |
    "Residential" |
    "Shops" |
    "Storage" |
    "Studio" |
    "Unknown" |
    "Utility"

type BuildingCondition =
    "Major Renovation Needed" |
    "Minor Renovation Needed" |
    "Replace or Dispose of" |
    "No Construction Needed"

type MaintenanceCondition =
    'Average' |
    'Good' |
    'Poor'


export const bldgOccupancyOptions: OccupancyType[] = [
    "Educational",
    "Health Care",
    "Meeting Place",
    "Office",
    "Parking",
    "Production",
    "Residential",
    "Shops",
    "Storage",
    "Studio",
    "Unknown",
    "Utility"
]

export const bldgMaintenanceConditionOptions: MaintenanceCondition[] = [
    'Average',
    'Good',
    'Poor'
]

export const bldgConditionOptions: BuildingCondition[] = [
    "Major Renovation Needed",
    "Minor Renovation Needed",
    "Replace or Dispose of",
    "No Construction Needed"
]