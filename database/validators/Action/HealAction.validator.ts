import {IsBoolean, IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {QueryOrder} from "../../enums";
import {CorePaginationValidator} from "../Core.validator";
import {ActionCreateValidator, ActionOrderByValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class HealActionCreateValidator extends ActionCreateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}

@InputType()
export class HealActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}

@InputType()
export class HealActionOrderByValidator extends ActionOrderByValidator {
  
  @Field(() => QueryOrder, {nullable: true})
  @IsEnum(QueryOrder)
  public direct?: QueryOrder;
  
  @Field(() => QueryOrder, {nullable: true})
  @IsEnum(QueryOrder)
  public reviving?: QueryOrder;
}

@InputType()
export class HealActionPaginationValidator extends CorePaginationValidator {
  
  @Field(() => HealActionOrderByValidator, {nullable: true})
  order_by?: HealActionOrderByValidator;
  
  public getOrderBy() {
    const result = {} as { [K in keyof HealActionOrderByValidator]?: QueryOrder };
    
    if (this.order_by?.direct) result.direct = this.order_by.direct;
    if (this.order_by?.id) result.direct = this.order_by.id;
    if (this.order_by?.type) result.direct = this.order_by.type;
    if (this.order_by?.reviving) result.direct = this.order_by.reviving;
    if (this.order_by?.created_at) result.direct = this.order_by.created_at;
    if (this.order_by?.periodic) result.direct = this.order_by.periodic;
    if (this.order_by?.updated_at) result.direct = this.order_by.updated_at;
    
    return result;
  }
  
}

