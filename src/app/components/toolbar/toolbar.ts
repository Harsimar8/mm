import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetImportService } from '../../core/services/AssetImportService';
import { AssetLibraryService } from '../../core/services/AssetLibraryService';

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
    private assetLibraryService: AssetLibraryService
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

}