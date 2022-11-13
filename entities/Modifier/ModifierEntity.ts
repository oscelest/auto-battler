import ModifierCategoryType from "../../enums/Modifier/ModifierCategoryType";
import ModifierType from "../../enums/Modifier/ModifierType";

export default abstract class ModifierEntity {

  public type: ModifierType;

  public value: number;
  public value_per_level: number;
  public category: ModifierCategoryType;

  protected constructor(type: ModifierType, initializer: ModifierEntityInitializer) {
    this.type = type;

    this.value = initializer.value;
    this.value_per_level = initializer.value_per_level ?? 0;
    this.category = initializer.category;
  }
}

export interface ModifierEntityInitializer {
  value: number;
  value_per_level?: number;
  category: ModifierCategoryType;
}
