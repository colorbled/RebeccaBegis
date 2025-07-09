// artworkData.js

import art4ThumbPlaceholder from './assets/art/4-angled-placeholder.jpg';
import art4First from './assets/art/4-angled-cropped.jpg';
import art4FirstPlaceholder from './assets/art/4-angled-cropped-placeholder.jpg';

import art2Thumbnail from './assets/art/thumbnails/2.jpg';
import art2ph from './assets/art/placeholders/2.jpg';
import art2Zoom from './assets/art/zoom/2.jpg';

import art3Thumbnail from './assets/art/thumbnails/3.jpg';
import art3ph from './assets/art/placeholders/3.jpg';
import art3Zoom from './assets/art/zoom/3.jpg';

import art4Thumbnail from './assets/art/thumbnails/4.jpg';
import art4ph from './assets/art/placeholders/4.jpg';
import art4Zoom from './assets/art/zoom/4.jpg';

import art5Thumbnail from './assets/art/thumbnails/5.jpg';
import art5ph from './assets/art/placeholders/5.jpg';
import art5Zoom from './assets/art/zoom/5.jpg';

/*
import art6Hr from './assets/art/highres/6.jpg';
import art6Thumbnail from './assets/art/thumbnails/6.jpg';
import art6ph from './assets/art/placeholders/6.jpg';
import art6Zoom from './assets/art/zoom/6.jpg';
*/

import art7Thumbnail from './assets/art/thumbnails/7.jpg';
import art7ph from './assets/art/placeholders/7.jpg';
import art7Zoom from './assets/art/zoom/7.jpg';

import art8Thumbnail from './assets/art/thumbnails/8.jpg';
import art8ph from './assets/art/placeholders/8.jpg';
import art8Zoom from './assets/art/zoom/8.jpg';

import art9Thumbnail from './assets/art/thumbnails/9.jpg';
import art9ph from './assets/art/placeholders/9.jpg';
import art9Zoom from './assets/art/zoom/9.jpg';


import art10Thumbnail from './assets/art/thumbnails/10.jpg';
import art10ph from './assets/art/placeholders/10.jpg';
import art10Zoom from './assets/art/zoom/10.jpg';

import art11Thumbnail from './assets/art/thumbnails/11.jpg';
import art12Thumbnail from './assets/art/thumbnails/12.jpg';
import art13Thumbnail from './assets/art/thumbnails/13.jpg';
import art14Thumbnail from './assets/art/thumbnails/14.jpg';
import art15Thumbnail from './assets/art/thumbnails/15.jpg';
import art16Thumbnail from './assets/art/thumbnails/16.jpg';
import art17Thumbnail from './assets/art/thumbnails/17.jpg';
import art18Thumbnail from './assets/art/thumbnails/18.jpg';
import art19Thumbnail from './assets/art/thumbnails/19.jpg';
import art20Thumbnail from './assets/art/thumbnails/20.jpg';
import art21Thumbnail from './assets/art/thumbnails/21.jpg';
import art22Thumbnail from './assets/art/thumbnails/22.jpg';
import art23Thumbnail from './assets/art/thumbnails/23.jpg';
import art24Thumbnail from './assets/art/thumbnails/24.jpg';


import art11Zoom from './assets/art/zoom/11.jpg';
import art12Zoom from './assets/art/zoom/12.jpg';
import art13Zoom from './assets/art/zoom/13.jpg';
import art16Zoom from './assets/art/zoom/16.jpg';
import art17Zoom from './assets/art/zoom/17.jpg';
import art18Zoom from './assets/art/zoom/18.jpg';
import art19Zoom from './assets/art/zoom/19.jpg';
import art20Zoom from './assets/art/zoom/20.jpg';
import art21Zoom from './assets/art/zoom/21.jpg';
import art22Zoom from './assets/art/zoom/22.jpg';
import art23Zoom from './assets/art/zoom/23.jpg';
import art24Zoom from './assets/art/zoom/24.jpg';

import art11ph from './assets/art/placeholders/11.jpg';
import art12ph from './assets/art/placeholders/12.jpg';
import art13ph from './assets/art/placeholders/13.jpg';
import art14ph from './assets/art/placeholders/14.jpg';
import art15ph from './assets/art/placeholders/15.jpg';
import art16ph from './assets/art/placeholders/16.jpg';
import art17ph from './assets/art/placeholders/17.jpg';
import art18ph from './assets/art/placeholders/18.jpg';
import art19ph from './assets/art/placeholders/19.jpg';
import art20ph from './assets/art/placeholders/20.jpg';
import art21ph from './assets/art/placeholders/21.jpg';
import art22ph from './assets/art/placeholders/22.jpg';
import art23ph from './assets/art/placeholders/23.jpg';
import art24ph from './assets/art/placeholders/24.jpg';


import art2ZoomPh from './assets/art/zoom/placeholders/2.jpg';
import art3ZoomPh from './assets/art/zoom/placeholders/3.jpg';
import art4ZoomPh from './assets/art/zoom/placeholders/4.jpg';
import art5ZoomPh from './assets/art/zoom/placeholders/5.jpg';
import art6ZoomPh from './assets/art/zoom/placeholders/6.jpg';
import art7ZoomPh from './assets/art/zoom/placeholders/7.jpg';
import art8ZoomPh from './assets/art/zoom/placeholders/8.jpg';
import art9ZoomPh from './assets/art/zoom/placeholders/9.jpg';
import art10ZoomPh from './assets/art/zoom/placeholders/10.jpg';
import art11ZoomPh from './assets/art/zoom/placeholders/11.jpg';
import art12ZoomPh from './assets/art/zoom/placeholders/12.jpg';
import art13ZoomPh from './assets/art/zoom/placeholders/13.jpg';
import art14ZoomPh from './assets/art/zoom/placeholders/14.jpg';
import art15ZoomPh from './assets/art/zoom/placeholders/15.jpg';
import art16ZoomPh from './assets/art/zoom/placeholders/16.jpg';
import art17ZoomPh from './assets/art/zoom/placeholders/17.jpg';
import art18ZoomPh from './assets/art/zoom/placeholders/18.jpg';
import art19ZoomPh from './assets/art/zoom/placeholders/19.jpg';
import art20ZoomPh from './assets/art/zoom/placeholders/20.jpg';
import art21ZoomPh from './assets/art/zoom/placeholders/21.jpg';
import art22ZoomPh from './assets/art/zoom/placeholders/22.jpg';
import art23ZoomPh from './assets/art/zoom/placeholders/23.jpg';
import art24ZoomPh from './assets/art/zoom/placeholders/24.jpg';



const artworkData = [
    {
        id: 1,
        title: 'Portrait of the Artist as a Swan',
        dimensions: '30x60',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art5Thumbnail,
        placeholder: art5ph,
        images: [
            art5Zoom
        ],
        placeholders: [
            art5ZoomPh
        ]
    },
    {
        id: 2,
        title: 'Bouquet of Flowers',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art2Thumbnail,
        placeholder: art2ph,
        images: [
            art2Zoom
        ],
        placeholders: [
            art2ZoomPh
        ]
    },
    {
        id: 3,
        title: 'Head in a Bush',
        dimensions: '11x14',
        medium: 'Oil on Wood Canvas',
        year: 2024,
        image: art4Thumbnail,
        placeholder: art4ph,
        images: [
            art4Zoom
        ],
        placeholders: [
            art4ZoomPh
        ]
    },
    {
        id: 4,
        title: 'Kaiju',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art4First,
        placeholder: art4ThumbPlaceholder,
        images: [
            art4First
        ],
        placeholders: [
            art4FirstPlaceholder
        ]
    },
    {
        id: 5,
        title: "My Mother's Anguish",
        dimensions: '24x30',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art3Thumbnail,
        placeholder: art3ph,
        images: [
            art3Zoom
        ],
        placeholders: [
            art3ZoomPh
        ]
    },
    {
        id: 6,
        title: 'My mother as a Centipede',
        dimensions: '30x40',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art7Thumbnail,
        placeholder: art7ph,
        images: [
            art7Zoom
        ],
        placeholders: [
            art7ZoomPh
        ]
    },
    {
        id: 7,
        title: 'Study of a Woman 1',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art10Thumbnail,
        placeholder: art10ph,
        images: [
            art10Zoom
        ],
        placeholders: [
            art10ZoomPh
        ]
    },
    {
        id: 8,
        title: 'Study of a Woman 2',
        dimensions: '24x36',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art8Thumbnail,
        placeholder: art8ph,
        images: [
            art8Zoom
        ],
        placeholders: [
            art8ZoomPh
        ]
    },
    {
        id: 9,
        title: 'Abstracted woman',
        dimensions: '24x30',
        medium: 'Oil on Stretched Canvas',
        year: 2024,
        image: art9Thumbnail,
        placeholder: art9ph,
        images: [
            art9Zoom
        ],
        placeholders: [
            art9ZoomPh
        ]
    },

    {
        id: 10,
        title: 'That Bitch',
        dimensions: '16x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: art11Thumbnail,
        placeholder: art11ph,
        images: [
            art11Zoom
        ],
        placeholders: [
            art11ZoomPh
        ]
    },
    {
        id: 11,
        title: 'Majestic Turkey',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art12Thumbnail,
        placeholder: art12ph,
        images: [
            art12Zoom
        ],
        placeholders: [
            art12ZoomPh
        ]
    },
    {
        id: 12,
        title: "A Boy's Surprise",
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art13Thumbnail,
        placeholder: art13ph,
        images: [
            art13Zoom
        ],
        placeholders: [
            art13ZoomPh
        ]
    },
    {
        id: 13,
        title: 'Running Fox',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2024,
        image: art14Thumbnail,
        placeholder: art14ph,
        images: [
            art14Thumbnail
        ],
        placeholders: [
            art14ZoomPh
        ]
    },
    {
        id: 14,
        title: 'Study of a Woman',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art15Thumbnail,
        placeholder: art15ph,
        images: [
            art15Thumbnail
        ],
        placeholders: [
            art15ZoomPh
        ]
    },
    {
        id: 15,
        title: 'Study of Love',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art16Thumbnail,
        placeholder: art16ph,
        images: [
            art16Zoom
        ],
        placeholders: [
            art16ZoomPh
        ]
    },
    {
        id: 16,
        title: 'The Dunce Frog',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art17Thumbnail,
        placeholder: art17ph,
        images: [
            art17Zoom
        ],
        placeholders: [
            art17ZoomPh
        ]
    },
    {
        id: 17,
        title: 'Study of a Fancy Cat',
        dimensions: '16x20',
        medium: 'Oil and Charcoal on Canvas Paper',
        year: 2024,
        image: art18Thumbnail,
        placeholder: art18ph,
        images: [
            art18Zoom
        ],
        placeholders: [
            art18ZoomPh
        ]
    },
    {
        id: 18,
        title: 'Cyclops',
        dimensions: '20x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: art19Thumbnail,
        placeholder: art19ph,
        images: [
            art19Zoom
        ],
        placeholders: [
            art19ZoomPh
        ]
    },
    {
        id: 19,
        title: 'The Displeased Cat',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2025,
        image: art20Thumbnail,
        placeholder: art20ph,
        images: [
            art20Zoom
        ],
        placeholders: [
            art20ZoomPh
        ]
    },
    {
        id: 20,
        title: "The Fishmonger's Secret",
        dimensions: '16x20',
        medium: 'Oil on Stretched Canvas',
        year: 2025,
        image: art21Thumbnail,
        placeholder: art21ph,
        images: [
            art21Zoom
        ],
        placeholders: [
            art21ZoomPh
        ]
    },
    {
        id: 21,
        title: 'Angry Woman',
        dimensions: '12x16',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art22Thumbnail,
        placeholder: art22ph,
        images: [
            art22Zoom
        ],
        placeholders: [
            art22ZoomPh
        ]
    },
    {
        id: 22,
        title: 'The Goldfish',
        dimensions: '16x20',
        medium: 'Oil on Wood Panel',
        year: 2024,
        image: art23Thumbnail,
        placeholder: art23ph,
        images: [
            art23Zoom
        ],
        placeholders: [
            art23ZoomPh
        ]
    },
    {
        id: 23,
        title: 'Rabbit Study',
        dimensions: '16x20',
        medium: 'Oil on Canvas Paper',
        year: 2024,
        image: art24Thumbnail,
        placeholder: art24ph,
        images: [
            art24Zoom
        ],
        placeholders: [
            art24ZoomPh
        ]
    }
];

export default artworkData;
