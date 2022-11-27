import {IsEnum, IsInt, Max, Min, ValidateIf} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {CoreEntity} from "../entities";
import {QueryOrder} from "../enums";
import {EntityOrderKey} from "../Globals";

@InputType({isAbstract: true})
export abstract class CorePaginationValidator<E extends CoreEntity> {
  
  @Field({nullable: true, defaultValue: 0})
  @IsInt()
  public offset!: number;
  
  @Field({nullable: true, defaultValue: 10})
  @IsInt()
  @Min(1)
  @Max(100)
  public limit!: number;
  
  @Field(() => [CoreSortOrder], {nullable: true})
  @IsEnum(() => CoreSortOrder, {each: true})
  @ValidateIf(object => object.constructor === CorePaginationValidator)
  public abstract order_by?: EntityOrderKey<E>[];
  
  public getOrderBy<K extends EntityOrderKey<E> = EntityOrderKey<E>>() {
    const result = {} as { [K in EntityOrderKey<E>]: QueryOrder };
    for (let value of this.order_by ?? []) {
      const [column, order] = value.split("|") as [EntityOrderKey<E>, QueryOrder];
      result[column] = order;
    }
    
    return result;
  }
  
  public static toEnumFromFieldList<T extends CoreEntity, K extends EntityOrderKey<CoreEntity> = EntityOrderKey<CoreEntity>>(list: K[]) {
    const result = {} as Record<string, `${K}|ASC` | `${K}|DESC`>;
    for (let value of list) {
      const base_key = value.replace(/\./g, "_");
      const ascending_key = `${base_key}_ASC`;
      const descending_key = `${base_key}_DESC`;
      
      const ascending_value = `${value}|ASC` as `${K}|ASC`;
      const descending_value = `${value}|DESC` as `${K}|DESC`;
      
      result[ascending_key] = ascending_value;
      result[descending_key] = descending_value;
    }
    
    return result;
  }
}


const CoreSortOrder = CorePaginationValidator.toEnumFromFieldList(["id", "created_at", "updated_at"]);
registerEnumType(CoreSortOrder, {name: "CoreSortOrder"});
