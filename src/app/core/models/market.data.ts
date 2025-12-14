import { ResourceDef } from './game.interfaces';

export interface MarketItem {
    id: string;
    basePrice: number;
}

export interface ThemeDef {
    id: string;
    name: string;
    cost: number;
    description: string;
    cssClass: string;
}

export const SELL_PRICES: Record<string, number> = {
    'common': 2,
    'uncommon': 5,
    'rare': 15,
    'epic': 40,
    'legendary': 100
};

export const BUY_MULTIPLIERS: Record<string, number> = {
    'common': 10,
    'uncommon': 12,
    'rare': 15,
    'epic': 20,
    'legendary': 100
};

export const THEMES: ThemeDef[] = [
    {
        id: 'default',
        name: 'Classic Gray',
        cost: 0,
        description: 'The standard Windows 95 experience.',
        cssClass: ''
    },
    {
        id: 'dark_mode',
        name: 'Dark Mode',
        cost: 500,
        description: 'A sleek dark theme for those late night coding sessions.',
        cssClass: 'theme-dark'
    },
    {
        id: 'ocean_blue',
        name: 'Ocean Blue',
        cost: 1000,
        description: 'Calming blue tones inspired by the deep sea.',
        cssClass: 'theme-ocean'
    },
    {
        id: 'forest_green',
        name: 'Forest Green',
        cost: 1000,
        description: 'Nature-inspired colors for the digital gardener.',
        cssClass: 'theme-forest'
    },
    {
        id: 'high_contrast',
        name: 'High Contrast',
        cost: 250,
        description: 'Maximum readability with stark blacks and whites.',
        cssClass: 'theme-contrast'
    }
];
