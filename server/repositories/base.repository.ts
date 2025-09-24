import { storage } from "../storage";
import type { IStorage } from "../storage";

export abstract class BaseRepository {
  protected storage: IStorage;

  constructor() {
    this.storage = storage;
  }
}

export { storage };