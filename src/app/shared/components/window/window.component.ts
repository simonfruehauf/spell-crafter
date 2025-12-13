import { Component, input, output, ElementRef, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="absolute min-w-[200px] p-[2px] bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray shadow-[inset_1px_1px_0_#dfdfdf] font-system text-xs"
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
      <div class="bg-gradient-to-r from-win95-blue-start to-win95-blue-end text-white p-[3px_4px] font-bold flex items-center select-none cursor-move"
           (mousedown)="onTitleBarMouseDown($event)">
        <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ title() }}</span>
        <div class="flex gap-[2px] ml-1">
          @if (showMinimize()) {
          <button class="w-4 h-[14px] p-0 flex items-center justify-center bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer text-[10px] leading-none active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[1px] active:pt-[1px]"
                  (click)="toggleMinimize(); $event.stopPropagation()">
            <span class="font-bold text-win95-black">_</span>
          </button>
          }
          @if (showClose()) {
          <button class="w-4 h-[14px] p-0 flex items-center justify-center bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer text-[10px] leading-none active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[1px] active:pt-[1px]"
                  (click)="onClose(); $event.stopPropagation()">
            <span class="font-bold text-win95-black text-[14px] -mt-[2px]">×</span>
          </button>
          }
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-win95-gray p-2" [class.hidden]="isMinimized()">
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

    ngOnInit(): void {
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
