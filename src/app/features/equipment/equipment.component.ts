import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { EquipmentItem, EquipmentSlot } from '../../core/models/game.interfaces';
import { EQUIPMENT_SLOT_NAMES, EQUIPMENT_BONUS_NAMES } from '../../core/models/equipment.data';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Equipment" 
      windowId="equipment"
      [initialX]="260" 
      [initialY]="260" 
      [width]="300"
      (closed)="onClose()">
      <div class="equipment-content">
        <div class="equipment-description">
          <p>Equip crafted gear to enhance your power.</p>
        </div>

        <div class="slots-grid">
          @for (slot of slots; track slot.id) {
            <div class="slot-row" (click)="toggleSlot(slot.id)">
              <span class="slot-name">{{ slot.name }}:</span>
              <div class="slot-value" [class.empty]="!getEquipped(slot.id)" [class.active]="selectedSlot() === slot.id">
                @if (getEquipped(slot.id); as item) {
                  <span class="item-name" [class]="item.rarity">{{ item.name }}</span>
                } @else {
                  <span class="empty-slot">[Empty]</span>
                }
              </div>
            </div>
          }
        </div>

        @if (selectedSlot()) {
          <fieldset class="slot-panel">
            <legend>{{ getSlotName(selectedSlot()!) }}</legend>
            
            @if (getEquipped(selectedSlot()!); as equipped) {
              <div class="equipped-info">
                <div class="item-header">
                  <span class="item-title" [class]="equipped.rarity">{{ equipped.name }}</span>
                  <span class="item-rarity">[{{ equipped.rarity }}]</span>
                </div>
                <div class="item-desc">{{ equipped.description }}</div>
                <div class="item-bonuses">
                  @for (bonus of equipped.bonuses; track $index) {
                    <span class="bonus" [class.negative]="bonus.value < 0">{{ formatBonus(bonus) }}</span>
                  }
                </div>
                <button class="btn btn-unequip" (click)="unequip(selectedSlot()!)">[-] Unequip</button>
              </div>
            }

            <div class="available-items">
              <div class="available-header">Available:</div>
              @if (getAvailableForSlot(selectedSlot()!).length === 0) {
                <div class="no-items">No items available for this slot.</div>
              } @else {
                @for (item of getAvailableForSlot(selectedSlot()!); track item.id) {
                  <div class="available-item" (click)="equip(item.id); $event.stopPropagation()">
                    <div class="avail-header">
                      <span class="avail-name" [class]="item.rarity">{{ item.name }}</span>
                    </div>
                    <div class="avail-bonuses">
                      @for (bonus of item.bonuses; track $index) {
                        <span class="bonus-sm" [class.negative]="bonus.value < 0">{{ formatBonus(bonus) }}</span>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          </fieldset>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .equipment-content {
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow-y: auto;
    }
    .equipment-description {
      padding: 6px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
      font-size: 11px;
    }
    .slots-grid {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .slot-row {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      cursor: pointer;
      border: 1px solid transparent;
      &:hover { background-color: #e8e8e8; }
    }
    .slot-name {
      font-weight: bold;
      font-size: 11px;
      min-width: 80px;
    }
    .slot-value {
      flex: 1;
      font-size: 11px;
      padding: 2px 6px;
      background-color: #f8f8f8;
      border: 1px solid #c0c0c0;
      &.empty { color: #808080; }
      &.active { border-color: #000080; background-color: #e0e0ff; }
    }
    .item-name {
      &.mundane { color: #404040; }
      &.elevated { color: #008800; }
      &.exceptional { color: #0066cc; }
      &.primal { color: #9900cc; }
      &.epochal { color: #cc6600; }
      &.unique { color: #cc0066; }
    }
    .empty-slot { font-style: italic; }
    .slot-panel { margin-top: 8px; }
    .equipped-info {
      padding: 6px;
      background-color: #e8ffe8;
      border: 1px solid #88cc88;
      margin-bottom: 8px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .item-title {
      &.mundane { color: #404040; }
      &.elevated { color: #008800; }
      &.exceptional { color: #0066cc; }
      &.primal { color: #9900cc; }
      &.epochal { color: #cc6600; }
      &.unique { color: #cc0066; }
    }
    .item-rarity { font-size: 9px; color: #606060; }
    .item-desc { font-size: 10px; color: #404040; margin: 4px 0; }
    .item-bonuses {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 4px 0;
    }
    .bonus {
      font-size: 10px;
      padding: 1px 4px;
      background-color: #ccffcc;
      border: 1px solid #88cc88;
      &.negative { background-color: #ffcccc; border-color: #cc8888; }
    }
    .btn-unequip {
      padding: 2px 8px;
      font-size: 10px;
      background-color: #ffcccc;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      &:hover { background-color: #ffaaaa; }
      &:active { border-color: #808080 #ffffff #ffffff #808080; }
    }
    .available-items { margin-top: 4px; }
    .available-header { font-weight: bold; font-size: 10px; margin-bottom: 4px; }
    .no-items { font-style: italic; font-size: 10px; color: #808080; }
    .available-item {
      padding: 4px 6px;
      margin: 2px 0;
      border: 1px solid #c0c0c0;
      background-color: #f8f8f8;
      cursor: pointer;
      &:hover { background-color: #e8e8ff; border-color: #8080ff; }
    }
    .avail-header { font-size: 11px; }
    .avail-name {
      &.mundane { color: #404040; }
      &.elevated { color: #008800; }
      &.exceptional { color: #0066cc; }
      &.primal { color: #9900cc; }
      &.epochal { color: #cc6600; }
      &.unique { color: #cc0066; }
    }
    .avail-bonuses { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; }
    .bonus-sm {
      font-size: 9px;
      padding: 0 3px;
      background-color: #e8ffe8;
      border: 1px solid #aaccaa;
      &.negative { background-color: #ffe8e8; border-color: #ccaaaa; }
    }
  `]
})
export class EquipmentComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly equippedItems = this.gameState.equippedItems;
  readonly craftedEquipment = this.gameState.craftedEquipment;

  readonly selectedSlot = signal<EquipmentSlot | null>(null);

  readonly slots: { id: EquipmentSlot; name: string }[] = [
    { id: 'head', name: 'Head' },
    { id: 'face', name: 'Face' },
    { id: 'accessory', name: 'Accessory' },
    { id: 'body', name: 'Body' },
    { id: 'handL', name: 'Left Hand' },
    { id: 'handR', name: 'Right Hand' },
    { id: 'relic', name: 'Relic' },
  ];

  getEquipped(slot: EquipmentSlot): EquipmentItem | null {
    return this.equippedItems()[slot];
  }

  getSlotName(slot: EquipmentSlot): string {
    return EQUIPMENT_SLOT_NAMES[slot] || slot;
  }

  getAvailableForSlot(slot: EquipmentSlot): EquipmentItem[] {
    return this.craftedEquipment().filter(i => i.slot === slot);
  }

  toggleSlot(slot: EquipmentSlot): void {
    if (this.selectedSlot() === slot) {
      this.selectedSlot.set(null);
    } else {
      this.selectedSlot.set(slot);
    }
  }

  formatBonus(bonus: { type: string; stat?: string; value: number }): string {
    const sign = bonus.value >= 0 ? '+' : '';
    if (bonus.type === 'stat' && bonus.stat) {
      return `${sign}${bonus.value} ${bonus.stat}`;
    }
    const name = EQUIPMENT_BONUS_NAMES[bonus.type] || bonus.type;
    const isPercent = ['damagePercent', 'critChance', 'critDamage', 'lootChance', 'lootQuantity'].includes(bonus.type);
    return `${sign}${bonus.value}${isPercent ? '%' : ''} ${name}`;
  }

  equip(itemId: string): void {
    this.gameState.equipItem(itemId);
  }

  unequip(slot: EquipmentSlot): void {
    this.gameState.unequipItem(slot);
  }

  onClose(): void {
    this.closed.emit();
  }
}
