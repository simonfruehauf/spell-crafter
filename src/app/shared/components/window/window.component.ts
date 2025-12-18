import { Component, input, output, ElementRef, OnInit, inject, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { windowAnimation } from '../../animations/animations';
import { GameStateService } from '../../../core/services/game-state.service';
import { WindowStates } from '../../../core/models/game.interfaces';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [windowAnimation],
    template: `
    <div class="window"
         @windowAnimation
         [class.h-auto]="isMinimized()"
         [class.cursor-move]="isDragging()"
         [class.select-none]="isDragging()"
         [style.left.px]="posX()"
         [style.top.px]="posY()"
         [style.width.px]="width()"
         [style.height]="height() === 'auto' ? 'auto' : height() + 'px'"
         [style.z-index]="zIndex()"
         (mousedown)="onWindowClick()">

      <!-- Title Bar -->
      <div class="title-bar" (mousedown)="onTitleBarMouseDown($event)">
        <span class="title-text">{{ title() }}</span>
        <div class="title-buttons">
          <ng-content select="[header-actions]"></ng-content>
          @if (showMinimize()) {
          <button class="window-btn" (click)="toggleMinimize(); $event.stopPropagation()">
            <span>_</span>
          </button>
          }
          @if (showClose()) {
          <button class="window-btn close-btn" (click)="onClose(); $event.stopPropagation()">
            <span>×</span>
          </button>
          }
        </div>
      </div>

      <!-- Content Area -->
      <div class="window-content" [class.hidden]="isMinimized()">
        <ng-content></ng-content>
      </div>
    </div>
    `
})
export class WindowComponent implements OnInit {
    title = input('Window');
    windowId = input('');
    showMinimize = input(true);
    showClose = input(true);
    initialX = input(50);
    initialY = input(50);
    width = input(300);
    height = input<number | 'auto'>('auto');

    closed = output<void>();

    private el = inject(ElementRef);
    private gameState = inject(GameStateService);

    // Position state
    readonly posX = signal(0);
    readonly posY = signal(0);
    readonly isMinimized = signal(false);
    readonly isDragging = signal(false);
    readonly zIndex = signal(1);

    private dragStartX = 0;
    private dragStartY = 0;
    private initialPosX = 0;
    private initialPosY = 0;

    private static highestZIndex = 1;

    constructor() {
        // Watch for position resets (when saved position becomes undefined)
        effect(() => {
            const windowId = this.windowId();
            if (!windowId) return;

            const windows = this.gameState.windows();
            const windowState = windows[windowId as keyof WindowStates];
            if (windowState && windowState.x === undefined && windowState.y === undefined) {
                this.posX.set(this.initialX());
                this.posY.set(this.initialY());
            }
        });
    }

    ngOnInit(): void {
        // Bring window to front when it opens
        this.bringToFront();

        // Try to load saved position, fall back to initial values
        if (this.windowId()) {
            const savedPos = this.gameState.getWindowPosition(this.windowId() as keyof WindowStates);
            this.posX.set(savedPos.x ?? this.initialX());
            this.posY.set(savedPos.y ?? this.initialY());
        } else {
            this.posX.set(this.initialX());
            this.posY.set(this.initialY());
        }
    }

    // Dragging handlers - works both minimized and normal
    onTitleBarMouseDown(event: MouseEvent): void {
        this.isDragging.set(true);
        this.bringToFront();

        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.initialPosX = this.posX();
        this.initialPosY = this.posY();

        // Add global listeners
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        event.preventDefault();
    }

    private onMouseMove = (event: MouseEvent): void => {
        if (!this.isDragging()) return;

        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;

        this.posX.set(Math.max(0, this.initialPosX + deltaX));
        this.posY.set(Math.max(0, this.initialPosY + deltaY));
    };

    private onMouseUp = (): void => {
        this.isDragging.set(false);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        // Save position when drag ends
        if (this.windowId()) {
            this.gameState.updateWindowPosition(
                this.windowId() as keyof WindowStates,
                this.posX(),
                this.posY()
            );
        }
    };

    onWindowClick(): void {
        this.bringToFront();
    }

    private bringToFront(): void {
        WindowComponent.highestZIndex++;
        this.zIndex.set(WindowComponent.highestZIndex);
    }

    toggleMinimize(): void {
        this.isMinimized.update(v => !v);
    }

    onClose(): void {
        this.closed.emit();
    }
}
