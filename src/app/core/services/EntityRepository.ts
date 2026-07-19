import { Injectable, signal } from '@angular/core';
import { Entity } from '../models/Entity';
@Injectable({
  providedIn: 'root'
})
export class EntityRepository {

  private readonly entities = signal<Entity[]>([]);

  readonly all = this.entities.asReadonly();

  constructor() {

    const saved = localStorage.getItem("entities");

    if (saved) {

      const entities = JSON.parse(saved) as Entity[];

      this.entities.set(entities);

      console.log("Entities restored:", entities);

    }

  }

  private save(): void {

    localStorage.setItem(
      "entities",
      JSON.stringify(this.entities())
    );

  }

  add(entity: Entity): void {

    this.entities.update(list => [...list, entity]);

    this.save();

  }

  remove(id: string): void {

    this.entities.update(list =>
      list.filter(e => e.id !== id)
    );

    this.save();

  }

  clear(): void {

    this.entities.set([]);

    this.save();

  }

  setAll(entities: Entity[]): void {

  this.entities.set(entities);

  this.save();

}

}