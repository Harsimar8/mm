import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorState } from '../../core/state/EditorState';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-panel.html',
  styleUrl: './property-panel.css'
})
export class PropertyPanel {

  constructor(
    public editorState: EditorState
  ) {}

  
  close(): void {

  this.editorState.selectedAsset.set(null);

  this.editorState.selectedEntity.set(null);

}

}