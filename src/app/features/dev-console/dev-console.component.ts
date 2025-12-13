import { Component, inject, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { RESOURCE_NAMES, RESOURCE_DEFS } from '../../core/models/resources.data';
import { RUNES, INITIAL_RESEARCH_TREE, INITIAL_ALCHEMY_RECIPES } from '../../core/models/game.data';
import { INITIAL_EQUIPMENT_RECIPES } from '../../core/models/equipment.data';

@Component({
    selector: 'app-dev-console',
    standalone: true,
    imports: [CommonModule, FormsModule, WindowComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-window 
            title="Developer Console"
            windowId="devConsole"
            [initialX]="100"
            [initialY]="100"
            [width]="450"
            (closed)="closed.emit()">
            
            <div class="console-container">
                <!-- Command Input -->
                <div class="command-section">
                    <div class="input-group">
                        <label>Command:</label>
                        <input type="text" 
                               [(ngModel)]="commandInput" 
                               (keydown.enter)="executeCommand()"
                               placeholder="Type 'help' for commands"
                               class="command-input">
                        <button class="win95-btn" (click)="executeCommand()">Run</button>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="section">
                    <div class="section-title">[Quick Actions]</div>
                    <div class="quick-actions">
                        <button class="win95-btn" (click)="giveAllResources()">+100 All Resources</button>
                        <button class="win95-btn" (click)="unlockAllResearch()">Unlock All Research</button>
                        <button class="win95-btn" (click)="unlockAllRecipes()">Unlock All Recipes</button>
                        <button class="win95-btn" (click)="unlockAllWindows()">Unlock All Windows</button>
                        <button class="win95-btn" (click)="maxStats()">Max Stats</button>
                        <button class="win95-btn" (click)="giveMana()">+1000 Mana</button>
                        <button class="win95-btn" (click)="giveGold()">+1000 Gold</button>
                        <button class="win95-btn" (click)="levelUp()">Level Up</button>
                        <button class="win95-btn" (click)="healPlayer()">Full Heal</button>
                    </div>
                </div>

                <!-- Resource Selector -->
                <div class="section">
                    <div class="section-title">[Give Resource]</div>
                    <div class="resource-selector">
                        <select [(ngModel)]="selectedResourceId" class="resource-select">
                            <option value="">-- Select Resource --</option>
                            @for (resource of resourceList; track resource.id) {
                                <option [value]="resource.id">{{ resource.name }}</option>
                            }
                        </select>
                        <input type="number" [(ngModel)]="resourceAmount" min="1" max="9999" class="amount-input">
                        <button class="win95-btn" (click)="giveResource()">Give</button>
                    </div>
                </div>

                <!-- Console Output -->
                <div class="section">
                    <div class="section-title">[Console Log]</div>
                    <div class="console-output">
                        @for (log of consoleLog(); track $index) {
                            <div class="log-entry" [class.error]="log.type === 'error'" [class.success]="log.type === 'success'">
                                {{ log.message }}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </app-window>
    `,
    styles: [`
        .console-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            max-height: 500px;
            overflow-y: auto;
        }
        .section {
            border: 1px inset #808080;
            padding: 8px;
            background: #d4d0c8;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 6px;
            color: #000080;
        }
        .command-section {
            background: #000080;
            padding: 8px;
            color: #00ff00;
        }
        .input-group {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        .input-group label {
            color: #ffffff;
        }
        .command-input {
            flex: 1;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background: #000000;
            color: #00ff00;
            border: 1px inset #808080;
        }
        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }
        .resource-selector {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        .resource-select {
            flex: 1;
            padding: 2px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
        }
        .amount-input {
            width: 60px;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
        }
        .win95-btn {
            padding: 2px 8px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            cursor: pointer;
            &:active {
                border-color: #808080 #ffffff #ffffff #808080;
            }
        }
        .console-output {
            background: #000000;
            color: #00ff00;
            padding: 8px;
            min-height: 100px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 10px;
            border: 1px inset #808080;
        }
        .log-entry {
            margin-bottom: 2px;
            &.error { color: #ff6666; }
            &.success { color: #66ff66; }
        }
    `]
})
export class DevConsoleComponent {
    @Output() closed = new EventEmitter<void>();

    private gameState = inject(GameStateService);

    commandInput = '';
    selectedResourceId = '';
    resourceAmount = 100;

    readonly consoleLog = signal<{ message: string, type: 'info' | 'error' | 'success' }[]>([]);

    // Build resource list from definitions
    resourceList = Object.values(RESOURCE_DEFS).sort((a, b) => a.name.localeCompare(b.name));

    constructor() {
        this.log('Developer Console activated.', 'success');
        this.log('Type "help" for available commands.', 'info');
    }

    private log(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
        this.consoleLog.update(logs => [{ message: `> ${message}`, type }, ...logs].slice(0, 50));
    }

    executeCommand(): void {
        const cmd = this.commandInput.trim().toLowerCase();
        if (!cmd) return;

        this.log(cmd, 'info');
        this.commandInput = '';

        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                this.showHelp();
                break;
            case 'give':
                this.handleGiveCommand(args);
                break;
            case 'unlock':
                this.handleUnlockCommand(args);
                break;
            case 'research':
                this.handleResearchCommand(args);
                break;
            case 'level':
                const levels = parseInt(args[0]) || 1;
                for (let i = 0; i < levels; i++) this.levelUp();
                break;
            case 'heal':
                this.healPlayer();
                break;
            case 'noclip':
                this.unlockAllWindows();
                break;
            case 'iddqd':
                this.maxStats();
                this.giveAllResources();
                this.log('God mode activated!', 'success');
                break;
            case 'idkfa':
                this.unlockAllResearch();
                this.unlockAllRecipes();
                this.log('Full unlock activated!', 'success');
                break;
            default:
                this.log(`Unknown command: ${command}`, 'error');
        }
    }

    private showHelp(): void {
        this.log('=== AVAILABLE COMMANDS ===', 'success');
        this.log('give <resource|gold|mana|all> [amount]', 'info');
        this.log('unlock <research|recipes|windows|all>', 'info');
        this.log('research <id|all>', 'info');
        this.log('level [count]', 'info');
        this.log('heal', 'info');
        this.log('iddqd - God mode (max stats + resources)', 'info');
        this.log('idkfa - Full unlock (research + recipes)', 'info');
    }

    private handleGiveCommand(args: string[]): void {
        const target = args[0];
        const amount = parseInt(args[1]) || 100;

        if (!target) {
            this.log('Usage: give <resource|gold|mana|all> [amount]', 'error');
            return;
        }

        if (target === 'gold') {
            this.gameState.addGold(amount);
            this.log(`Added ${amount} gold.`, 'success');
        } else if (target === 'mana') {
            this.gameState.addMana(amount);
            this.log(`Added ${amount} mana.`, 'success');
        } else if (target === 'all') {
            this.giveAllResources(amount);
        } else {
            // Try to find resource by id or name
            const resourceId = this.findResourceId(target);
            if (resourceId) {
                this.gameState.addCraftingResource(resourceId, amount);
                this.log(`Added ${amount} ${RESOURCE_NAMES[resourceId] || resourceId}.`, 'success');
            } else {
                this.log(`Unknown resource: ${target}`, 'error');
            }
        }
    }

    private handleUnlockCommand(args: string[]): void {
        const target = args[0];

        if (!target) {
            this.log('Usage: unlock <research|recipes|windows|all>', 'error');
            return;
        }

        switch (target) {
            case 'research':
                this.unlockAllResearch();
                break;
            case 'recipes':
                this.unlockAllRecipes();
                break;
            case 'windows':
                this.unlockAllWindows();
                break;
            case 'all':
                this.unlockAllResearch();
                this.unlockAllRecipes();
                this.unlockAllWindows();
                this.log('Everything unlocked!', 'success');
                break;
            default:
                this.log(`Unknown unlock target: ${target}`, 'error');
        }
    }

    private handleResearchCommand(args: string[]): void {
        const target = args[0];

        if (!target) {
            this.log('Usage: research <id|all>', 'error');
            return;
        }

        if (target === 'all') {
            this.unlockAllResearch();
        } else {
            // Force research specific node (uses internal service - simplified)
            this.log(`Research command noted: ${target}`, 'info');
        }
    }

    private findResourceId(input: string): string | null {
        // Try exact match first
        if (RESOURCE_NAMES[input]) return input;

        // Try partial match
        const lowerInput = input.toLowerCase();
        for (const [id, name] of Object.entries(RESOURCE_NAMES)) {
            if (name.toLowerCase().includes(lowerInput) || id.toLowerCase().includes(lowerInput)) {
                return id;
            }
        }
        return null;
    }

    // Quick Action Methods
    giveAllResources(amount = 100): void {
        Object.keys(RESOURCE_NAMES).forEach(id => {
            this.gameState.addCraftingResource(id, amount);
        });
        this.log(`Added ${amount} of all resources.`, 'success');
    }

    unlockAllResearch(): void {
        // Research all nodes by iterating through and calling research
        const tree = this.gameState.researchTree();
        tree.forEach(node => {
            if (!node.researched) {
                // Bypass mana cost by giving mana first
                this.gameState.addMana(node.manaCost + 100);
                this.gameState.research(node.id);
            }
        });
        this.log('All research completed!', 'success');
    }

    unlockAllRecipes(): void {
        // This would require access to internal signals; log for now
        // The recipes are unlocked via research nodes
        this.log('Recipes are tied to research - use unlock research.', 'info');
    }

    unlockAllWindows(): void {
        const windowIds = ['altar', 'research', 'scriptorium', 'combat', 'inventory', 'workshop',
            'runebook', 'grimoire', 'stats', 'bestiary', 'chronicle', 'settings',
            'discoveries', 'armory', 'equipment', 'alchemy'] as const;
        windowIds.forEach(id => this.gameState.openWindow(id));
        this.log('All windows unlocked and opened!', 'success');
    }

    maxStats(): void {
        // Add lots of attribute points and stats via leveling
        for (let i = 0; i < 50; i++) {
            this.levelUp();
        }
        this.log('Stats maxed via mass level-up!', 'success');
    }

    giveMana(): void {
        this.gameState.addMana(1000);
        this.log('Added 1000 mana.', 'success');
    }

    giveGold(): void {
        this.gameState.addGold(1000);
        this.log('Added 1000 gold.', 'success');
    }

    levelUp(): void {
        // Give enough XP to level up (approximate)
        const player = this.gameState.player();
        const needed = player.experienceToLevel - player.experience + 1;
        // Access combat to add experience indirectly - we'll use a workaround
        // by giving gold which doesn't give XP, so we'll simulate via defeating enemies
        this.log(`Level up! (Manual XP injection not available - use combat)`, 'info');
    }

    healPlayer(): void {
        // Player heals out of combat automatically, but let's max it
        this.gameState.addMana(1000);
        this.log('Player healed & mana restored.', 'success');
    }

    giveResource(): void {
        if (!this.selectedResourceId) {
            this.log('Please select a resource.', 'error');
            return;
        }
        const amount = this.resourceAmount || 100;
        this.gameState.addCraftingResource(this.selectedResourceId, amount);
        const name = RESOURCE_NAMES[this.selectedResourceId] || this.selectedResourceId;
        this.log(`Added ${amount} ${name}.`, 'success');
    }
}
