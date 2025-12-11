import {
    trigger,
    transition,
    style,
    animate,
    state,
    keyframes,
    AnimationTriggerMetadata
} from '@angular/animations';

/**
 * Fade and slide animation for content entering/leaving
 */
export const fadeSlide: AnimationTriggerMetadata = trigger('fadeSlide', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
    ])
]);

/**
 * Simple fade animation
 */
export const fade: AnimationTriggerMetadata = trigger('fade', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
    ])
]);

/**
 * Scale animation for modals/windows
 */
export const scaleIn: AnimationTriggerMetadata = trigger('scaleIn', [
    transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
    ])
]);

/**
 * Slide from right animation for windows
 */
export const slideInRight: AnimationTriggerMetadata = trigger('slideInRight', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
]);

/**
 * Pulse animation for attention-grabbing elements
 */
export const pulse: AnimationTriggerMetadata = trigger('pulse', [
    transition(':enter', [
        animate('600ms ease-in-out', keyframes([
            style({ opacity: 0, transform: 'scale(0.9)', offset: 0 }),
            style({ opacity: 1, transform: 'scale(1.05)', offset: 0.5 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
    ])
]);

/**
 * Combat hit flash animation
 */
export const hitFlash: AnimationTriggerMetadata = trigger('hitFlash', [
    state('idle', style({ filter: 'brightness(1)' })),
    state('hit', style({ filter: 'brightness(1)' })),
    transition('idle => hit', [
        animate('100ms', keyframes([
            style({ filter: 'brightness(1)', offset: 0 }),
            style({ filter: 'brightness(1.5)', offset: 0.2 }),
            style({ filter: 'brightness(0.8)', offset: 0.4 }),
            style({ filter: 'brightness(1)', offset: 1 })
        ]))
    ])
]);

/**
 * Shake animation for damage effects
 */
export const shake: AnimationTriggerMetadata = trigger('shake', [
    transition('* => shake', [
        animate('300ms', keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-5px)', offset: 0.1 }),
            style({ transform: 'translateX(5px)', offset: 0.2 }),
            style({ transform: 'translateX(-5px)', offset: 0.3 }),
            style({ transform: 'translateX(5px)', offset: 0.4 }),
            style({ transform: 'translateX(-3px)', offset: 0.5 }),
            style({ transform: 'translateX(3px)', offset: 0.6 }),
            style({ transform: 'translateX(-2px)', offset: 0.7 }),
            style({ transform: 'translateX(0)', offset: 1 })
        ]))
    ])
]);

/**
 * List item stagger animation (use with *ngFor and CSS animation-delay)
 */
export const listItem: AnimationTriggerMetadata = trigger('listItem', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
]);

/**
 * Window open/close animation with Win95 feel
 */
export const windowAnimation: AnimationTriggerMetadata = trigger('windowAnimation', [
    transition(':enter', [
        style({
            opacity: 0,
            transform: 'scale(0.8) translateY(-20px)',
            transformOrigin: 'top left'
        }),
        animate('150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({
            opacity: 1,
            transform: 'scale(1) translateY(0)'
        }))
    ]),
    transition(':leave', [
        animate('100ms ease-in', style({
            opacity: 0,
            transform: 'scale(0.9)',
            transformOrigin: 'top left'
        }))
    ])
]);

/**
 * All animations exported as array for easy importing
 */
export const gameAnimations = [
    fadeSlide,
    fade,
    scaleIn,
    slideInRight,
    pulse,
    hitFlash,
    shake,
    listItem,
    windowAnimation
];
