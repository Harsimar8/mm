import { EntityIconFactory } from '../../core/factories/EntityIconFactory';

export class CesiumIconFactory {

  static get(entityType: string): string {

    return EntityIconFactory.get(entityType);

  }

}