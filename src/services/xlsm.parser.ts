import { ref } from "vue";
import { read, type WorkSheet } from "xlsx";
import { useFacilitiesStore } from "@/stores/facilities";
import { useDateFormat } from "@vueuse/core";
import { useSurveysStore } from "@/stores/surveys";
import type { Facility } from "@/types/facility";
import type { Survey } from "@/types/survey";
import type { ElementSurvey } from "@/types/elementSurvey";
import type { Element } from "@/types/element";
import type { ElementLibrary } from "@/types/elementLibrary";
import type { Building } from "@/types/building";
import { useElementsStore } from "@/stores/elements";
import { useElementSurveys } from "@/stores/element.surveys";
import { useBuildingsStore } from "@/stores/buildings";

export const useXlsmParser = () => {

    const START_ROW = 83
    const END_ROW = 300

    const facilitiesStore = useFacilitiesStore()
    const surveysStore = useSurveysStore()
    const buildingsStore = useBuildingsStore()
    const elementsStore = useElementsStore()
    const elementsSurveys = useElementSurveys()

    const elementSurveys: ElementSurvey[] = []
    const facilityElements: Element[] = []
    const facilityBuildings: Building[] = []
    const elementsLibrary: ElementLibrary[] = []

    const facility = ref<Facility>({
        whq: "",
        location: "",
        primaryUse: "",
        measurements: 'Metric',
        climate: "Dry",
        congregations: 0,
        auditoriums: 0,
        buildings: 0,
    });

    const survey = ref<Survey>({
        whq: "",
        date: "",
        elements: [],
        year: 0,
        uniqueKey: "",
        description: "",
    })

    const handleFileImport = async (file: File) => {
        if (!file) return;

        const data = await file.arrayBuffer();
        const opts = {};

        const x = read(data, opts);
        const evaluationSheet = x.Sheets["Evaluation"];
        const elementsSheet = x.Sheets["Elements"];

        await loadFacility(evaluationSheet)
        await loadSurvey(evaluationSheet)
        await loadBuildings(evaluationSheet)
        await loadElementsLibrary(elementsSheet)
        await loadElements(evaluationSheet)
        await loadElementsSurvey(evaluationSheet)
    }

    const loadFacility = async (evaluationSheet: WorkSheet) => {
        facility.value.auditoriums = evaluationSheet['H15'].v
        facility.value.buildings = evaluationSheet['H17'].v
        facility.value.climate = evaluationSheet['H7'].v
        facility.value.congregations = evaluationSheet['H13'].v
        facility.value.location = evaluationSheet['H5'].v
        facility.value.measurements = evaluationSheet['H9'].v
        facility.value.primaryUse = evaluationSheet['H11'].v
        facility.value.whq = evaluationSheet['H20'].v

        if (facility.value.whq) {
            facility.value.whq = facility.value.whq.split('-')[0]
        }

        facilitiesStore.add(JSON.parse(
            JSON.stringify(facility.value)
        ));
    }

    const loadSurvey = async (evaluationSheet: WorkSheet) => {
        const surveyDate = convertExcelDate(evaluationSheet['H3'].v)
        survey.value.whq = facility.value.whq
        survey.value.date = useDateFormat(surveyDate, "YYYY-MM-DD").value
        survey.value.year = evaluationSheet['P3'].v
        survey.value.description = evaluationSheet['AF3'].v
        survey.value.uniqueKey = `${survey.value.whq}_${useDateFormat(surveyDate, "YYYYMMDD").value}`

        surveysStore.add(JSON.parse(
            JSON.stringify(survey.value)
        ))

    }

    const loadBuildings = async (evaluationSheet: WorkSheet) => {
        const BLDG_START_ROW = 20
        const BLDG_END_ROW = 20 + ((facility.value.buildings - 1) * 2)

        facilityBuildings.length = 0

        for (let index = BLDG_START_ROW; index <= BLDG_END_ROW; index += 2) {
            const isVisible = Boolean(evaluationSheet[`H${index}`])
            if (isVisible) {
                const building: Building = {
                    facilityWhq: facility.value.whq,
                    whq: evaluationSheet[`H${index}`]?.v,
                    name: evaluationSheet[`L${index}`]?.v,
                    levels: evaluationSheet[`P${index}`]?.v,
                    occupancy: evaluationSheet[`R${index}`]?.v,
                    gfa: evaluationSheet[`V${index}`]?.v,
                    construction: evaluationSheet[`AA${index}`]?.v,
                    renMajYear: evaluationSheet[`AD${index}`]?.v,
                    maintenance: evaluationSheet[`AH${index}`]?.v,
                    building: evaluationSheet[`AL${index}`]?.v,
                    projRenYear: evaluationSheet[`AP${index}`]?.v,
                }
                facilityBuildings.push(building)
            }
        }

        const storable = JSON.parse(JSON.stringify(facilityBuildings));
        buildingsStore.batchAdd(facility.value.whq,
            JSON.parse(JSON.stringify(storable))
        )
    }

    const loadElementsLibrary = async (elementsSheet: WorkSheet) => {
        const LIB_START_ROW = 3
        const LIB_END_ROW = 500

        for (let index = LIB_START_ROW; index <= LIB_END_ROW; index++) {
            const isVisible = Boolean(elementsSheet[`B${index}`])
            if (isVisible) {
                const elemLibraryItem: ElementLibrary = {
                    category: elementsSheet[`B${index}`]?.v,
                    costCode: elementsSheet[`C${index}`]?.v,
                    num: elementsSheet[`D${index}`]?.v,
                    name: elementsSheet[`E${index}`]?.v,
                    component: elementsSheet[`F${index}`]?.v,
                    unit: elementsSheet[`G${index}`]?.v,
                    tropical: elementsSheet[`H${index}`]?.v,
                    dry: elementsSheet[`I${index}`]?.v,
                    temperate: elementsSheet[`J${index}`]?.v,
                    cold: elementsSheet[`K${index}`]?.v,
                    coastal: elementsSheet[`L${index}`]?.v,
                    active: elementsSheet[`O${index}`]?.v,
                    uniqueKey: elementsSheet[`P${index}`]?.v,
                    componentId: elementsSheet[`Q${index}`]?.v,
                }
                elementsLibrary.push(elemLibraryItem)
            }
        }
    }

    const loadElements = async (evaluationSheet: WorkSheet) => {
        facilityElements.length = 0
        let categoryGroup = ''

        for (let index = START_ROW; index <= END_ROW; index++) {
            if (evaluationSheet[`AA${index}`]) {

                const uniqueKey = `${evaluationSheet["F" + index]?.v}_${evaluationSheet["P" + index]?.v}`
                const relatedLibItem = elementsLibrary.find(e => e.uniqueKey === uniqueKey)

                categoryGroup = evaluationSheet[`C${index}`]?.v ? evaluationSheet[`C${index}`]?.v : categoryGroup

                if (relatedLibItem) {
                    const element: Element = {
                        srcRow: index,
                        whq: facility.value.whq,
                        uniqueKey: uniqueKey,
                        category: relatedLibItem.category,
                        categoryGroup: categoryGroup,
                        component: relatedLibItem.component,
                        componentId: relatedLibItem.componentId,
                        costCode: relatedLibItem.costCode,
                        name: relatedLibItem.name,
                        num: relatedLibItem.num,
                        qtyUnit: evaluationSheet[`AB${index}`]?.v,
                        unit: relatedLibItem.unit,
                        life: getElementLife(uniqueKey)
                    }

                    facilityElements.push(element)
                }
            }
        }

        elementsStore.batchAdd(facility.value.whq,
            JSON.parse(JSON.stringify(facilityElements))
        )

    }

    const loadElementsSurvey = async (evaluationSheet: WorkSheet) => {

        elementSurveys.length = 0
        let categoryGroup = ''

        for (let index = START_ROW; index <= END_ROW; index++) {
            categoryGroup = evaluationSheet[`C${index}`]?.v ? evaluationSheet[`C${index}`]?.v : categoryGroup

            if (evaluationSheet[`AA${index}`]) {
                const itemSurvey: ElementSurvey = {
                    srcRow: index,
                    categoryGroup: categoryGroup,
                    condition: evaluationSheet[`AF${index}`]?.v,
                    remainingYears: evaluationSheet[`AG${index}`]?.v,
                    adjRemainingYears: evaluationSheet[`AI${index}`]?.v,
                    information: evaluationSheet[`AJ${index}`]?.v,
                    qty: evaluationSheet[`AA${index}`]?.v,
                    lastYear: evaluationSheet[`AC${index}`]?.v,
                    surveyKey: survey.value.uniqueKey,
                    key: `${evaluationSheet["F" + index]?.v}_${evaluationSheet["P" + index]?.v}`,
                    whq: facility.value.whq
                }


                elementSurveys.push(itemSurvey)
            }
        }

        const storable = JSON.parse(JSON.stringify(elementSurveys))
        elementsSurveys.batchAdd(survey.value.uniqueKey, storable)

    }

    const convertExcelDate = (xlsDate: any) => {
        return typeof xlsDate === "number"
            ? new Date(Date.UTC(1899, 11, 30) + xlsDate * 86400000)
            : new Date(xlsDate);
    }

    const getElementLife = (key: string) => {
        type climateOptions = 'tropical' | 'dry' | 'temperate' | 'cold' | 'coastal'
        const elemLibrary = elementsLibrary.find(e => e.uniqueKey === key)
        if (!elemLibrary) return 0
        const climate = facility.value.climate.toLocaleLowerCase() as climateOptions
        return elemLibrary[climate] ?? 0
    }

    return {
        handleFileImport
    }
}