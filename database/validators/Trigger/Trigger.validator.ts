import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {TriggerType} from "../../enums";

@InputType({isAbstract: true})
export abstract class TriggerCreateValidator {
  
  @Field(() => TriggerType)
  @IsEnum(TriggerType)
  public type!: TriggerType;
  
}

export abstract class TriggerUpdateValidator {
  
  @Field(() => TriggerType, {nullable: true})
  @IsEnum(TriggerType)
  public type?: TriggerType;
  
}
