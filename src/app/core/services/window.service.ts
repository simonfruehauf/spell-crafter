import { Injectable, signal } from '@angular/core';
import { WindowStates } from '../models/game.interfaces';

export interface WindowSignals {
    windows: ReturnType<typeof signal<WindowStates>>;
}

@Injectable({ providedIn: 'root' })
export class WindowService {
    private signals: WindowSignals | null = null;

    registerSignals(signals: WindowSignals): void {
        this.signals = signals;
    }

    createInitialWindows(): WindowStates {
        return {
            altar: { unlocked: true, visible: true },
            research: { unlocked: true, visible: true },
            scriptorium: { unlocked: false, visible: false, x: 30, y: 320 },
            laboratory: { unlocked: false, visible: false, x: 400, y: 300 },
            combat: { unlocked: false, visible: false, x: 500, y: 40 },
            inventory: { unlocked: false, visible: false },
            workshop: { unlocked: false, visible: false },
            runebook: { unlocked: false, visible: false },
            grimoire: { unlocked: false, visible: false },
            stats: { unlocked: true, visible: true },
            bestiary: { unlocked: false, visible: false },
            chronicle: { unlocked: false, visible: false },
            settings: { unlocked: true, visible: false },
            discoveries: { unlocked: false, visible: false },
            armory: { unlocked: false, visible: false },
            equipment: { unlocked: false, visible: false },
            alchemy: { unlocked: false, visible: false },
            apothecary: { unlocked: false, visible: false },
            goblinApprentice: { unlocked: false, visible: false },
            garden: { unlocked: false, visible: false },
            spellbook: { unlocked: false, visible: false },
            market: { unlocked: false, visible: false },
        };
    }

    openWindow(id: keyof WindowStates): void {
        if (!this.signals) return;
        this.signals.windows.update(w => ({ ...w, [id]: { ...w[id], visible: true } }));
    }

    closeWindow(id: keyof WindowStates): void {
        if (!this.signals) return;
        this.signals.windows.update(w => ({ ...w, [id]: { ...w[id], visible: false } }));
    }

    toggleWindow(id: keyof WindowStates): void {
        if (!this.signals) return;
        const current = this.signals.windows()[id];
        if (current.unlocked) {
            this.signals.windows.update(w => ({ ...w, [id]: { ...w[id], visible: !w[id].visible } }));
        }
    }

    unlockWindow(id: keyof WindowStates): void {
        if (!this.signals) return;
        this.signals.windows.update(w => ({ ...w, [id]: { ...w[id], unlocked: true } }));
    }

    closeAllWindows(): void {
        if (!this.signals) return;
        this.signals.windows.update(windows => {
            const updated = { ...windows };
            for (const key of Object.keys(updated) as (keyof WindowStates)[]) {
                if (updated[key].unlocked) {
                    updated[key] = { ...updated[key], visible: false };
                }
            }
            return updated;
        });
    }

    updateWindowPosition(id: keyof WindowStates, x: number, y: number): void {
        if (!this.signals) return;
        this.signals.windows.update(w => ({ ...w, [id]: { ...w[id], x, y } }));
    }

    getWindowPosition(id: keyof WindowStates): { x?: number; y?: number } {
        if (!this.signals) return {};
        const w = this.signals.windows()[id];
        return { x: w?.x, y: w?.y };
    }

    resetAllWindowPositions(): void {
        if (!this.signals) return;
        this.signals.windows.update(windows => {
            const updated = { ...windows };
            for (const key of Object.keys(updated) as (keyof WindowStates)[]) {
                updated[key] = { ...updated[key], x: undefined, y: undefined };
            }
            return updated;
        });
    }
}
