import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {TriggerType} from "../../enums/Discriminator/TriggerType";

@InputType({isAbstract: true})
export default abstract class TriggerValidator {
  
  @Field(() => TriggerType)
  @IsEnum(TriggerType)
  public type!: TriggerType;
  
}
