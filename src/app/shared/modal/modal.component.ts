import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-component',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Output() closed = new EventEmitter<void>();

  closeModal() {
    this.closed.emit(); // Emitir evento para cerrar el modal
  }
}
