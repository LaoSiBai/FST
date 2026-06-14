export type Color = [number, number, number];

export interface GradientStop {
    pos: number;
    color: Color;
}

export interface TimeStopConfig {
    hour: number;
    easing: string;
    stops: GradientStop[];
}

export const timeStops: TimeStopConfig[] = [
    {
        hour: 0,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [1, 4, 10] },
            { pos: 40, color: [2, 8, 20] },
            { pos: 70, color: [4, 12, 30] },
            { pos: 100,color: [1, 6, 15] }
        ]
    },
    {
        hour: 3.5,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [2, 3, 10] },
            { pos: 35, color: [4, 6, 18] },
            { pos: 65, color: [6, 8, 25] },
            { pos: 100,color: [3, 4, 14] }
        ]
    },
    {
        hour: 4.5,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [3, 4, 14] },
            { pos: 30, color: [8, 12, 40] },
            { pos: 55, color: [15, 25, 65] },
            { pos: 85, color: [25, 45, 95] },
            { pos: 100,color: [10, 15, 45] }
        ]
    },
    {
        hour: 5.25,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [8, 15, 45] },
            { pos: 25, color: [20, 35, 80] },
            { pos: 50, color: [40, 65, 110] },
            { pos: 75, color: [80, 100, 120] },
            { pos: 100,color: [30, 50, 95] }
        ]
    },
    {
        hour: 5.75,
        easing: 'easeInOutQuad',
        stops: [
            { pos: 0,  color: [20, 30, 70] },
            { pos: 25, color: [40, 60, 100] },
            { pos: 50, color: [100, 110, 115] },
            { pos: 75, color: [160, 155, 110] },
            { pos: 100,color: [60, 80, 130] }
        ]
    },
    {
        hour: 7.5,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [70, 120, 190] },
            { pos: 35, color: [120, 180, 225] },
            { pos: 65, color: [185, 220, 195] },
            { pos: 100,color: [95, 160, 210] }
        ]
    },
    {
        hour: 11,
        easing: 'easeInOutQuad',
        stops: [
            { pos: 0,  color: [55, 165, 235] },
            { pos: 45, color: [110, 200, 245] },
            { pos: 75, color: [180, 230, 205] },
            { pos: 100,color: [75, 180, 230] }
        ]
    },
    {
        hour: 14,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [65, 160, 230] },
            { pos: 40, color: [130, 190, 220] },
            { pos: 70, color: [195, 210, 165] },
            { pos: 100,color: [95, 170, 215] }
        ]
    },
    {
        hour: 16.5,
        easing: 'easeInCubic',
        stops: [
            { pos: 0,  color: [55, 145, 215] },
            { pos: 35, color: [150, 175, 195] },
            { pos: 65, color: [210, 185, 125] },
            { pos: 100,color: [110, 145, 185] }
        ]
    },
    {
        hour: 18.5,
        easing: 'easeOutCubic',
        stops: [
            { pos: 0,  color: [40, 85, 155] },
            { pos: 30, color: [185, 125, 85] },
            { pos: 55, color: [225, 155, 65] },
            { pos: 80, color: [165, 105, 95] },
            { pos: 100,color: [65, 60, 115] }
        ]
    },
    {
        hour: 19.5,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [30, 50, 110] },
            { pos: 35, color: [120, 60, 110] },
            { pos: 65, color: [80, 40, 100] },
            { pos: 85, color: [45, 30, 80] },
            { pos: 100,color: [25, 25, 70] }
        ]
    },
    {
        hour: 20.5,
        easing: 'easeInOutCubic',
        stops: [
            { pos: 0,  color: [8, 15, 35] },
            { pos: 35, color: [15, 25, 60] },
            { pos: 65, color: [10, 18, 45] },
            { pos: 100,color: [5, 10, 25] }
        ]
    },
    {
        hour: 22.5,
        easing: 'easeInCubic',
        stops: [
            { pos: 0,  color: [3, 8, 20] },
            { pos: 40, color: [5, 18, 45] },
            { pos: 70, color: [4, 12, 35] },
            { pos: 100,color: [2, 6, 18] }
        ]
    }
];
