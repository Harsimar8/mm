import { Injectable, signal } from '@angular/core';

import { AssetDefinition } from '../models/AssetDefinition';
import { Entity } from '../models/Entity';
import { Team } from '../types/Team';

@Injectable({
  providedIn: 'root'
})
export class EditorState {

  readonly selectedAsset = signal<AssetDefinition | null>(null);

  readonly selectedEntity = signal<Entity | null>(null);

  readonly selectedTeam = signal<Team>(Team.Blue);

}