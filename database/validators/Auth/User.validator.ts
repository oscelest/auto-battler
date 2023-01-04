import {IsString, Length} from "class-validator";
import {Field, InputType} from "type-graphql";

@InputType()
export class UserSignupValidator {
  
  @Field()
  @IsString()
  @Length(4, 62)
  public username!: string;
  
  @Field()
  @IsString()
  @Length(4, 512)
  public email!: string;
  
  @Field()
  @IsString()
  @Length(8, 512)
  public password!: string;
  
  
}

