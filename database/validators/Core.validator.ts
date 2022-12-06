import {QueryOrderMap} from "@mikro-orm/core/enums";
import {IsEnum, IsInt, Max, Min, ValidateIf} from "class-validator";
import {Field, InputType} from "type-graphql";
import {CoreEntity} from "../entities";
import {QueryOrder} from "../enums";
import {EntityOrderKey} from "../Globals";

@InputType({isAbstract: true})
export abstract class CorePaginationValidator<E extends CoreEntity> {
  
  protected entity!: E;
  
  @Field({nullable: true, defaultValue: 0})
  @IsInt()
  public offset!: number;
  
  @Field({nullable: true, defaultValue: 10})
  @IsInt()
  @Min(1)
  @Max(100)
  public limit!: number;
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  @ValidateIf(object => object.constructor === CorePaginationValidator)
  public abstract order_by?: EntityOrderKey<E>[];
  
  public get orderBy() {
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
}

const order_by_enum = CoreEntity.registerAsEnum("id", ["created_at", "updated_at"]);
