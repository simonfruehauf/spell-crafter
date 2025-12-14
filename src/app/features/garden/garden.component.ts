import { Component, inject, output, computed, signal, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { GardenPlot, ResourceDef } from '../../core/models/game.interfaces';
import { getResourcesByCategory, RESOURCE_NAMES } from '../../core/models/resources.data';

@Component({
  selector: 'app-garden',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Garden" 
      windowId="garden"
      [initialX]="250" 
      [initialY]="120" 
      [width]="340"
      (closed)="onClose()">
      <div class="garden-content">
        <div class="garden-description">
          <p>Cultivate magical herbs. Plant something to harvest more once it's grown.</p>
        </div>

        <div class="plots-container" [class.single]="plotCount() === 1" [class.double]="plotCount() === 2">
          @for (plot of visiblePlots(); track plot.id) {
            <div class="plot" [class.planted]="plot.plantedHerbId" [class.ready]="isReady(plot)">
              @if (!plot.plantedHerbId) {
                <!-- Empty plot -->
                <div class="plot-empty">
                  <div class="plot-icon">[_]</div>
                  @if (plantableHerbs().length > 0) {
                    <select class="herb-select" (change)="onHerbSelect($event, plot.id)">
                      <option value="">Select herb...</option>
                      @for (herb of plantableHerbs(); track herb.id) {
                        <option [value]="herb.id">{{ herb.name }} ({{ herb.id === 'mint_plant' ? 'free' : getHerbCount(herb.id) }})</option>
                      }
                    </select>
                  } @else {
                    <div class="no-herbs">No herbs to plant</div>
                  }
                </div>
              } @else if (isReady(plot)) {
                <!-- Ready to harvest -->
                <div class="plot-ready">
                  <div class="plot-icon">[*]</div>
                  <div class="plot-label">{{ getHerbName(plot.plantedHerbId) }}</div>
                  <div class="plot-status">Ready!</div>
                  <button 
                    class="btn btn-harvest"
                    (click)="harvest(plot.id)">
                    Harvest
                  </button>
                </div>
              } @else {
                <!-- Growing -->
                <div class="plot-growing">
                  <div class="plot-icon">[.]</div>
                  <div class="plot-label">{{ getHerbName(plot.plantedHerbId) }}</div>
                  <div class="plot-status">Growing...</div>
                  <div class="progress-container">
                    <div class="progress-bar" [style.width.%]="getProgress(plot.id)"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .garden-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .garden-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      font-style: italic;
      font-size: 11px;
    }
    .plots-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 8px;
      background: white;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      justify-items: center;
    }
    .plots-container.single {
      grid-template-columns: 1fr;
    }
    .plots-container.double {
      grid-template-columns: repeat(2, 1fr);
    }
    .plot {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      border: 1px solid #808080;
      background-color: #c0c0c0;
      min-height: 90px;
      width: 90px;
    }
    .plot.planted {
      background-color: #c0f0c0;
    }
    .plot-icon {
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .plot-label {
      font-size: 9px;
      font-weight: bold;
      color: #006000;
      margin-bottom: 2px;
      text-align: center;
    }
    .plot-empty, .plot-ready, .plot-growing {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      min-height: 80px;
    }
    .plot-status {
      font-size: 10px;
      color: #404040;
      margin-bottom: 4px;
    }
    .herb-select {
      width: 100%;
      font-size: 9px;
      padding: 2px;
      background-color: white;
      border: 1px solid;
      border-color: #808080 #ffffff #ffffff #808080;
    }
    .no-herbs {
      font-size: 9px;
      color: #808080;
      font-style: italic;
    }
    .btn {
      padding: 2px 8px;
      font-size: 10px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      font-family: monospace;
      &:hover { background-color: #d0d0d0; }
      &:active { border-color: #808080 #ffffff #ffffff #808080; }
    }
    .btn-harvest {
      font-weight: bold;
    }
    .progress-container {
      width: 100%;
      background: #ffffff;
      border: 1px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      height: 8px;
      padding: 1px;
    }
    .progress-bar {
      background: repeating-linear-gradient(
        90deg, 
        #008000 0px, #008000 4px, 
        #c0c0c0 4px, #c0c0c0 6px
      );
      height: 100%;
    }
  `]
})
export class GardenComponent implements OnDestroy {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly garden = this.gameState.garden;
  readonly resources = this.gameState.resources;

  // Tick signal for progress updates
  private readonly tick = signal(0);
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  // All herb types from resources
  private readonly allHerbs = getResourcesByCategory('herb');

  readonly plotCount = computed(() => {
    return this.gameState.getUnlockedPlotCount();
  });

  readonly visiblePlots = computed(() => {
    this.tick(); // Depend on tick for reactive updates
    const g = this.garden();
    const unlockedCount = this.plotCount();
    return g.plots.filter((_, idx) => idx < unlockedCount);
  });

  readonly plantableHerbs = computed(() => {
    this.tick(); // Update when resources change
    const crafting = this.resources().crafting;
    // 'mint_plant' is always available for free, others need at least 1 seed
    const owned = this.allHerbs.filter(herb =>
      herb.id === 'mint_plant' || (crafting[herb.id] || 0) >= 1
    );
    // Put 'mint_plant' first
    return owned.sort((a, b) => a.id === 'mint_plant' ? -1 : b.id === 'mint_plant' ? 1 : 0);
  });

  constructor() {
    // Start ticking for plant growth progress updates
    this.startTicking();
  }

  ngOnDestroy(): void {
    this.stopTicking();
  }

  private startTicking(): void {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => {
      this.tick.update(t => t + 1);
    }, 500);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  isReady(plot: GardenPlot): boolean {
    return this.gameState.isPlotReady(plot.id);
  }

  getProgress(plotId: number): number {
    return this.gameState.getPlotProgress(plotId);
  }

  getHerbCount(herbId: string): number {
    return this.resources().crafting[herbId] || 0;
  }

  getHerbName(herbId: string | null): string {
    if (!herbId) return '';
    return RESOURCE_NAMES[herbId] || herbId;
  }

  onHerbSelect(event: Event, plotId: number): void {
    const select = event.target as HTMLSelectElement;
    const herbId = select.value;
    if (herbId) {
      this.gameState.plantHerb(plotId, herbId);
      select.value = ''; // Reset selection
    }
  }

  harvest(plotId: number): void {
    this.gameState.harvestPlot(plotId);
  }

  onClose(): void {
    this.closed.emit();
  }
}
