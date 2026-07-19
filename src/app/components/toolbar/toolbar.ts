import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorState } from '../../core/state/EditorState';
import { ViewMode } from '../../core/models/ViewMode';
import { AssetImportService } from '../../core/services/AssetImportService';
import { AssetLibraryService } from '../../core/services/AssetLibraryService';
import { EntityRepository } from '../../core/services/EntityRepository';
import { ScenarioService } from '../../core/services/ScenarioService';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {

  constructor(
    private assetImportService: AssetImportService,
    private assetLibraryService: AssetLibraryService,
    public editorState: EditorState,
     private entityRepository: EntityRepository,
       private scenarioService: ScenarioService
  ) {}

  async onFileSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    await this.assetImportService.import(input.files[0]);

    input.value = '';
  }

  removeJson(): void {

    this.assetLibraryService.clear();

    console.log("Asset library cleared.");

  }

  showSplit(): void {

    this.editorState.viewMode.set(ViewMode.Split);

}

show2D(): void {

    this.editorState.viewMode.set(ViewMode.TwoD);

}

show3D(): void {

    this.editorState.viewMode.set(ViewMode.ThreeD);


}
clearScenario(): void {

    this.entityRepository.clear();

    this.editorState.selectedEntity.set(null);

    this.editorState.selectedAsset.set(null);

    console.log("Scenario cleared.");

}

saveScenario(): void {

    this.scenarioService.saveScenario();

}

loadScenario(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
        return;
    }

    this.scenarioService.loadScenario(input.files[0]);

    input.value = '';

}

}