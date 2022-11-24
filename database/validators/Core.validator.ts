import {IsEnum, IsInt, Max, Min} from "class-validator";
import {Field, InputType} from "type-graphql";
import {QueryOrder} from "../enums";

@InputType({isAbstract: true})
export abstract class CoreOrderByValidator {
  
  @Field(() => QueryOrder, {nullable: true})
  @IsEnum(QueryOrder)
  public id?: QueryOrder;
  
  @Field(() => QueryOrder, {nullable: true})
  @IsEnum(QueryOrder)
  public created_at?: QueryOrder;
  
  @Field(() => QueryOrder, {nullable: true})
  @IsEnum(QueryOrder)
  public updated_at?: QueryOrder;
  
}

@InputType({isAbstract: true})
export abstract class CorePaginationValidator {
  
  @Field({nullable: true, defaultValue: 0})
  @IsInt()
  public offset!: number;
  
  @Field({nullable: true, defaultValue: 10})
  @IsInt()
  @Min(1)
  @Max(100)
  public limit!: number;
  
  @Field(() => CoreOrderByValidator, {nullable: true})
  public abstract order_by?: CoreOrderByValidator;
  
  public abstract getOrderBy(): { [K in keyof this["order_by"]]?: QueryOrder }
  
}




