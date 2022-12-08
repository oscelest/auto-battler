import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {EffectEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {EffectCreateValidator, EffectPaginationValidator, EffectUpdateValidator} from "../../validators/Effect/Effect.validator";

@Resolver(() => EffectEntity)
export class EffectResolver {
  
  @Query(() => EffectEntity, {nullable: true})
  public async getEffect(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = EffectEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(EffectEntity, {id}, {fields, populate});
  }
  
  @Query(() => [EffectEntity])
  public async getEffectList(@Arg("pagination") pagination: EffectPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = EffectEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(EffectEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => EffectEntity)
  public async createEffect(@Arg("data") data: EffectCreateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = new EffectEntity(data);
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => EffectEntity)
  public async updateEffect(@Arg("id") id: string, @Arg("data") data: EffectUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(EffectEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => EffectEntity)
  public async deleteEffect(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(EffectEntity).removeAndFlush({id});
  }
}
