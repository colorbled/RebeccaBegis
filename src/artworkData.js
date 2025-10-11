// artworkData.js
import artThumbnails from './artThumbnails.js';
import artZoomPlaceholders from './artZoomPlaceholders.js';
import artZoomImages from './artZoomImages';
import artPlaceholderImages from './artPlaceholderImages';

const artworkData = [
    // Fixed first item
    {
        id: 1,
        title: 'Portrait of the Artist as a Swan',
        dimensions: '30x60',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[5],
        placeholder: artPlaceholderImages[5],
        images: [artZoomImages[5]],
        placeholders: [artZoomPlaceholders[5]]
    },
/*
    {
        id: 26,
        title: 'asdf',
        dimensions: '30x60',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: artThumbnails[26],
        placeholder: artPlaceholderImages[26],
        images: [artZoomImages[26]],
        placeholders: [artZoomPlaceholders[26]]
    },
*/
    // Sorted 2025 works
    {
        id: 10,
        title: 'That Bitch',
        dimensions: '16x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: artThumbnails[11],
        placeholder: artPlaceholderImages[11],
        images: [artZoomImages[11]],
        placeholders: [artZoomPlaceholders[11]]
    },
    {
        id: 18,
        title: 'Cyclops',
        dimensions: '20x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: artThumbnails[19],
        placeholder: artPlaceholderImages[19],
        images: [artZoomImages[19]],
        placeholders: [artZoomPlaceholders[19]]
    },
    {
        id: 19,
        title: 'The Displeased Cat',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2025,
        image: artThumbnails[20],
        placeholder: artPlaceholderImages[20],
        images: [artZoomImages[20]],
        placeholders: [artZoomPlaceholders[20]]
    },
    {
        id: 20,
        title: "The Fishmonger's Secret",
        dimensions: '16x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: artThumbnails[21],
        placeholder: artPlaceholderImages[21],
        images: [artZoomImages[21]],
        placeholders: [artZoomPlaceholders[21]]
    },

    // Sorted 2024 works
    {
        id: 2,
        title: 'Bouquet of Flowers',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[2],
        placeholder: artPlaceholderImages[2],
        images: [artZoomImages[2]],
        placeholders: [artZoomPlaceholders[2]]
    },
    {
        id: 3,
        title: 'Head in a Bush',
        dimensions: '11x14',
        medium: 'Oil on Wood Canvas',
        year: 2024,
        image: artThumbnails[4],
        placeholder: artPlaceholderImages[4],
        images: [artZoomImages[4]],
        placeholders: [artZoomPlaceholders[4]]
    },
    {
        id: 4,
        title: 'Kaiju',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[6],
        placeholder: artPlaceholderImages[6],
        images: [artZoomImages[6]],
        placeholders: [artZoomPlaceholders[6]]
    },
    {
        id: 5,
        title: "My Mother's Anguish",
        dimensions: '24x30',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[3],
        placeholder: artPlaceholderImages[3],
        images: [artZoomImages[3]],
        placeholders: [artZoomPlaceholders[3]]
    },
    {
        id: 6,
        title: 'My mother as a Centipede',
        dimensions: '30x40',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[7],
        placeholder: artPlaceholderImages[7],
        images: [artZoomImages[7]],
        placeholders: [artZoomPlaceholders[7]]
    },
    {
        id: 7,
        title: 'Study of a Woman 1',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[10],
        placeholder: artPlaceholderImages[10],
        images: [artZoomImages[10]],
        placeholders: [artZoomPlaceholders[10]]
    },
    {
        id: 8,
        title: 'Study of a Woman 2',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[8],
        placeholder: artPlaceholderImages[8],
        images: [artZoomImages[8]],
        placeholders: [artZoomPlaceholders[8]]
    },
    {
        id: 9,
        title: 'Abstracted woman',
        dimensions: '24x30',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: artThumbnails[9],
        placeholder: artPlaceholderImages[9],
        images: [artZoomImages[9]],
        placeholders: [artZoomPlaceholders[9]]
    },
    {
        id: 11,
        title: 'Majestic Turkey',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[12],
        placeholder: artPlaceholderImages[12],
        images: [artZoomImages[12]],
        placeholders: [artZoomPlaceholders[12]]
    },
    {
        id: 12,
        title: "A Boy's Surprise",
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[13],
        placeholder: artPlaceholderImages[13],
        images: [artZoomImages[13]],
        placeholders: [artZoomPlaceholders[13]]
    },
    {
        id: 13,
        title: 'Running Fox',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2024,
        image: artThumbnails[14],
        placeholder: artPlaceholderImages[14],
        images: [artThumbnails[14]],
        placeholders: [artZoomPlaceholders[14]]
    },
    {
        id: 14,
        title: 'Study of a Woman',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[15],
        placeholder: artPlaceholderImages[15],
        images: [artZoomImages[15]],
        placeholders: [artZoomPlaceholders[15]]
    },
    {
        id: 16,
        title: 'The Dunce Frog',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[17],
        placeholder: artPlaceholderImages[17],
        images: [artZoomImages[17]],
        placeholders: [artZoomPlaceholders[17]]
    },
    {
        id: 17,
        title: 'Study of a Fancy Cat',
        dimensions: '16x20',
        medium: 'Oil and Charcoal on Canvas Paper',
        year: 2024,
        image: artThumbnails[18],
        placeholder: artPlaceholderImages[18],
        images: [artZoomImages[18]],
        placeholders: [artZoomPlaceholders[18]]
    },
    {
        id: 21,
        title: 'Angry Woman',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[22],
        placeholder: artPlaceholderImages[22],
        images: [artZoomImages[22]],
        placeholders: [artZoomPlaceholders[22]]
    },
    {
        id: 22,
        title: 'The Goldfish',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: artThumbnails[23],
        placeholder: artPlaceholderImages[23],
        images: [artZoomImages[23]],
        placeholders: [artZoomPlaceholders[23]]
    },
    {
        id: 23,
        title: 'Rabbit Study',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2024,
        image: artThumbnails[24],
        placeholder: artPlaceholderImages[24],
        images: [artZoomImages[24]],
        placeholders: [artZoomPlaceholders[24]]
    },
    {
        id: 24,
        title: 'Dementia Death in the Neuron Forest',
        dimensions: '27x30.5',
        medium: 'Oil on Stretched Canvas',
        year: 2008,
        image: artThumbnails[27],
        placeholder: artPlaceholderImages[27],
        images: [artZoomImages[27]],
        placeholders: [artZoomPlaceholders[27]]
    },
    {
        id: 25,
        title: 'Woman and Peaches',
        dimensions: '26x26',
        medium: 'Oil on Stretched Canvas',
        year: 2008,
        image: artThumbnails[28],
        placeholder: artPlaceholderImages[28],
        images: [artZoomImages[28]],
        placeholders: [artZoomPlaceholders[28]]
    },
    {
        id: 27,
        title: 'Grave Digger',
        dimensions: '36x36',
        medium: 'Oil on Stretched Canvas',
        year: 2008,
        image: artThumbnails[29],
        placeholder: artPlaceholderImages[29],
        images: [artZoomImages[29]],
        placeholders: [artZoomPlaceholders[29]]
    },
    {
        id: 28,
        title: 'Dead Deer',
        dimensions: '36.6x49',
        medium: 'Oil on Stretched Canvas',
        year: 2008,
        image: artThumbnails[30],
        placeholder: artPlaceholderImages[30],
        images: [artZoomImages[30]],
        placeholders: [artZoomPlaceholders[30]]
    }
];

export default artworkData;
