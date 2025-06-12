import { ref } from "vue";
import { read, utils, type WorkSheet } from "xlsx";
import { useFacilitiesStore } from "@/stores/facilities";
import { useDateFormat } from "@vueuse/core";
import { useSurveysStore } from "@/stores/surveys";
import type { Facility } from "@/types/facility";
import type { Survey } from "@/types/survey";
import type { ElementSurvey } from "@/types/elementSurvey";
import type { Element } from "@/types/element";
import type { ElementLibrary } from "@/types/elementLibrary";
import { useElementsStore } from "@/stores/elements";

export const useXlsmParser = () => {

    const START_ROW = 83
    const END_ROW = 300

    const facilitiesStore = useFacilitiesStore()
    const surverysStore = useSurveysStore()
    const elementsStore = useElementsStore()

    const elementSurveys: ElementSurvey[] = []
    const facilityElements: Element[] = []
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
        // await loadBuildings(evaluationSheet)
        await loadElementsLibrary(elementsSheet)
        await loadElements(evaluationSheet)
        // await loadElementsSurvey(evaluationSheet)
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

        surverysStore.add(JSON.parse(
            JSON.stringify(survey.value)
        ))

    }

    const loadBuildings = async (evaluationSheet: WorkSheet) => {

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
        for (let index = START_ROW; index <= END_ROW; index++) {
            if (evaluationSheet[`AA${index}`]) {

                const uniqueKey = `${evaluationSheet["F" + index]?.v}_${evaluationSheet["P" + index]?.v}`
                const relatedLibItem = elementsLibrary.find(e => e.uniqueKey === uniqueKey)

                if (relatedLibItem) {
                    const element: Element = {
                        whq: facility.value.whq,
                        uniqueKey: uniqueKey,
                        category: relatedLibItem.category,
                        component: relatedLibItem.component,
                        componentId: relatedLibItem.componentId,
                        costCode: relatedLibItem.costCode,
                        name: relatedLibItem.name,
                        num: relatedLibItem.num,
                        qtyUnit: evaluationSheet[`AB${index}`]?.v,
                        unit: relatedLibItem.unit
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

        for (let index = START_ROW; index <= END_ROW; index++) {
            if (evaluationSheet[`AA${index}`]) {
                const itemSurvey: ElementSurvey = {
                    condition: evaluationSheet[`AF${index}`]?.v,
                    remainingYears: evaluationSheet[`AH${index}`]?.v,
                    adjRemainingYears: evaluationSheet[`AI${index}`]?.v,
                    information: evaluationSheet[`AJ${index}`]?.v,
                    qty: evaluationSheet[`AA${index}`]?.v,
                    lastYear: evaluationSheet[`AC${index}`]?.v,
                    surveyKey: survey.value.uniqueKey,
                    key: `${evaluationSheet["F" + index]?.v}_${evaluationSheet["P" + index]?.v}`
                }

                elementSurveys.push(itemSurvey)
            }
        }
    }

    const convertExcelDate = (xlsDate: any) => {
        return typeof xlsDate === "number"
            ? new Date(Date.UTC(1899, 11, 30) + xlsDate * 86400000)
            : new Date(xlsDate);
    }

    return {
        handleFileImport
    }
}