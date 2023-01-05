import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";

@ObjectType({implements: CoreEntity})
@Entity()
export class UserEntity extends CoreEntity<UserEntity> {
  
  @Field(() => String)
  @Property({length: 512})
  public email: string;
  
  @Field(() => String)
  @Property({length: 64})
  public username: string;
  
  @Field()
  @Property()
  public login_at: Date;
  
  @Property({hidden: true})
  public salt: Buffer;
  
  @Property({hidden: true})
  public hash: Buffer;
  
  constructor(initializer: UserEntityInitializer) {
    super(initializer);
    this.username = initializer.username;
    this.email = initializer.email;
    this.hash = initializer.hash;
    this.salt = initializer.salt;
    this.login_at = initializer.login_at ?? new Date();
  }
}

export interface UserEntityInitializer extends CoreEntityInitializer {
  username: string;
  email: string;
  login_at?: Date;
  hash: Buffer;
  salt: Buffer;
}

