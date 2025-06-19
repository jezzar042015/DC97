type ComponentDictionary = {
    [key: string]: {
        defination: string;
        photos?: string[]
    };
};

export const componentDictionary: ComponentDictionary = {
    '1_Masonry': {
        defination: 'Refers to CHB walls either it is plastered or not',
        photos: [
            'facility-components/1_Masonry.jpg'
        ]
    },
    '1_PC Reinforced concrete post and panel': {
        defination: 'Refers to concrete pouring walls',
        photos: [
            'facility-components/2_PC Reinforced.png'
        ]
    },
    '2_Chain Link (Galvanized)': {
        defination: 'Refers to cyclone fence, barb wires and razor wire fence',
        photos: [
            'facility-components/2_Chain Link.jpg'
        ]
    },
    '2_Wrought Iron': {
        defination: 'Refers to angular bar fence',
        photos: [
            'facility-components/2_Angular Bar.jpg'
        ]
    }
};