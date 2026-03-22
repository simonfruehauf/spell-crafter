import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ResourceCost } from '../models/game.interfaces';

// Event Types Base
export interface GameEvent {
  type: string;
  payload?: unknown;
}

// Concrete Event Definitions
export interface EnemyDefeatedEvent extends GameEvent {
  type: 'ENEMY_DEFEATED';
  payload: {
    enemyId: string;
    goldReward: number;
    expReward: number;
  };
}

export interface ResourceGainedEvent extends GameEvent {
  type: 'RESOURCE_GAINED';
  payload: {
    resourceId: string;
    amount: number;
    source?: string;
  };
}

export interface ManaSpendRequestedEvent extends GameEvent {
  type: 'MANA_SPEND_REQUESTED';
  payload: {
    amount: number;
    reason: string;
    resolve: (success: boolean) => void;
  };
}

export interface ResourceSpendRequestedEvent extends GameEvent {
  type: 'RESOURCE_SPEND_REQUESTED';
  payload: {
    costs: ResourceCost[];
    reason: string;
    resolve: (success: boolean) => void;
  };
}

export interface UpgradePurchasedEvent extends GameEvent {
  type: 'UPGRADE_PURCHASED';
  payload: {
    upgradeId: string;
  };
}

export interface CombatLogEvent extends GameEvent {
  type: 'COMBAT_LOG';
  payload: {
    message: string;
    logType: 'damage' | 'heal' | 'info' | 'victory' | 'defeat' | 'loot' | 'effect' | 'crit';
  };
}

export interface SpellCraftedEvent extends GameEvent {
  type: 'SPELL_CRAFTED';
  payload: {
    spellId: string;
  };
}

export interface ManaRestoredEvent extends GameEvent {
  type: 'MANA_RESTORED';
  payload: {
    amount: number;
    source?: string;
  };
}

export interface SpellExperienceGainedEvent extends GameEvent {
  type: 'SPELL_EXPERIENCE_GAINED';
  payload: {
    spellId: string;
    amount: number;
  };
}

export interface EquipmentCraftedEvent extends GameEvent {
    type: 'EQUIPMENT_CRAFTED';
    payload: {
        equipmentId: string;
    };
}

export interface FeatureUnlockedEvent extends GameEvent {
    type: 'FEATURE_UNLOCKED';
    payload: {
        featureId: string;
    };
}

// Union of all events for strong typing (optional but helpful)
export type AppEvent =
  | EnemyDefeatedEvent
  | ResourceGainedEvent
  | ManaSpendRequestedEvent
  | ManaRestoredEvent
  | SpellExperienceGainedEvent
  | ResourceSpendRequestedEvent
  | UpgradePurchasedEvent
  | CombatLogEvent
  | SpellCraftedEvent
  | EquipmentCraftedEvent
  | FeatureUnlockedEvent;

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private subject$ = new Subject<AppEvent>();

  /**
   * Emit an event to the bus.
   */
  emit(event: AppEvent): void {
    this.subject$.next(event);
  }

  /**
   * Listen for specific event types.
   */
  on<T extends AppEvent>(eventType: T['type']): Observable<T> {
    return this.subject$.asObservable().pipe(
      filter((e): e is T => e.type === eventType)
    );
  }
}
