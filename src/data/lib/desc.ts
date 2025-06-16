import type { ConditionNumber } from "@/types/element"

export const elementConditionDescriptions: Record<ConditionNumber, {
    label: string
    desc: string
}> = {
    1: {
        label: "Good",
        desc: "Element is in 'as new' condition or without noticeable defect"
    },
    2: {
        label: "Acceptable",
        desc: "Still in reasonable overall serviceable condition; could have had previous repairs. "
    },
    3: {
        label: "Deffective",
        desc: "Element needs some major repairs in the very near future"
    },
    4: {
        label: "Seriously Deffective",
        desc: "Element is is deteriorating or malfunctioning beyond repair and needs replacement."
    },
}