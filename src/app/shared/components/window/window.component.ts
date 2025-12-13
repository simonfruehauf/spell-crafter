import { Component, Input, Output, EventEmitter, ElementRef, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { windowAnimation } from '../../animations/animations';
import { GameStateService } from '../../../core/services/game-state.service';
import { WindowStates } from '../../../core/models/game.interfaces';

@Component({
    selector: 'app-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './window.component.html',
    styleUrl: './window.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [windowAnimation]
})
export class WindowComponent implements OnInit {
    @Input() title = 'Window';
    @Input() windowId = '';
    @Input() showMinimize = true;
    @Input() showClose = true;
    @Input() initialX = 50;
    @Input() initialY = 50;
    @Input() width = 300;
    @Input() height: number | 'auto' = 'auto';

    @Output() closed = new EventEmitter<void>();

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
        if (this.windowId) {
            const savedPos = this.gameState.getWindowPosition(this.windowId as keyof WindowStates);
            this.posX.set(savedPos.x ?? this.initialX);
            this.posY.set(savedPos.y ?? this.initialY);
        } else {
            this.posX.set(this.initialX);
            this.posY.set(this.initialY);
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
        if (this.windowId) {
            this.gameState.updateWindowPosition(
                this.windowId as keyof WindowStates,
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
