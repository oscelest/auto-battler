import {QueryOrderMap} from "@mikro-orm/core/enums";
import {IsEnum, IsInt, Max, Min, ValidateIf} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {CoreEntity} from "../entities";
import {QueryOrder} from "../enums";
import {EntityOrderKey} from "../Globals";

@InputType({isAbstract: true})
export abstract class CorePaginationValidator<E extends CoreEntity = CoreEntity> {
  
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
    const result = {} as any;
    
    for (let value of this.order_by ?? []) {
      
      const [column_root, order] = value.split("|") as [EntityOrderKey<E>, QueryOrder];
      const column_list = column_root.split(".");
      
      let current = result;
      for (let i = 0; i < column_list.length; i++) {
        const column = column_list[i];
        if (i === column_list.length - 1) {
          if (!current[column]) {
            current[column] = order;
          }
        }
        else if (!result[column]) {
          current[column] = {};
          current = result[column];
        }
        else {
          current = result[column];
        }
      }
    }
    
    return result as QueryOrderMap<E>;
  }
  
  public static toEnumFromFieldList<T extends CoreEntity, K extends EntityOrderKey<T> = EntityOrderKey<T>>(list: K[]) {
    const result = {} as Record<string, `${K}|${QueryOrder.ASC}` | `${K}|${QueryOrder.DESC}`>;
    for (let value of list) {
      const base_key = value.replace(/\./g, "_");
      const ascending_key = `${base_key}_${QueryOrder.ASC}`;
      const descending_key = `${base_key}_${QueryOrder.DESC}`;
      
      const ascending_value = `${value}|${QueryOrder.ASC}` as `${K}|${QueryOrder.ASC}`;
      const descending_value = `${value}|${QueryOrder.DESC}` as `${K}|${QueryOrder.DESC}`;
      
      result[ascending_key] = ascending_value;
      result[descending_key] = descending_value;
    }
    
    return result;
  }
}

const CoreSortOrder = CorePaginationValidator.toEnumFromFieldList(["id", "created_at", "updated_at"]);
registerEnumType(CoreSortOrder, {name: "CoreSortOrder"});
