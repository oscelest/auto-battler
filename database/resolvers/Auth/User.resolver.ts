import Crypto from "crypto";
import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {UserEntity} from "../../entities/Auth/User";
import {GraphQLContext} from "../../Globals";
import {UserSignupValidator} from "../../validators/Auth/User.validator";

@Resolver(() => UserEntity)
export class UserResolver {
  
  @Query(() => UserEntity)
  public async loginByPassword(@Arg("email") email: string, @Arg("password") password: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = UserEntity.fromContextToFieldsAndPopulate(info);
    fields.push("salt", "hash");
    
    const entity = await ctx.entity_manager.findOneOrFail(UserEntity, {email}, {fields, populate});
    const hash = Crypto.pbkdf2Sync(password, entity.salt, 10000, 255, "sha512");
    if (entity.hash !== hash) throw new Error("Hash not equal");
    
    return entity;
  }
  
  @Query(() => UserEntity)
  public async loginByJWT(@Arg("token") token: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = UserEntity.fromContextToFieldsAndPopulate(info);
    const id = token;
    return await ctx.entity_manager.findOne(UserEntity, {id}, {fields, populate});
  }
  
  @Mutation(() => UserEntity)
  public async signup(@Arg("data") data: UserSignupValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const salt = Crypto.randomBytes(64);
    const hash = Crypto.pbkdf2Sync(data.password, salt, 10000, 255, "sha512");
    
    const entity = new UserEntity({...data, salt, hash});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
}
