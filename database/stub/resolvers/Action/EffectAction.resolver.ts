import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {EffectActionEntity, EffectEntity, ModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {EffectActionCreateValidator, EffectActionPaginationValidator, EffectActionUpdateValidator} from "../../validators/Action/EffectAction.validator";

@Resolver(() => EffectActionEntity)
export class EffectActionResolver {
  
  @Query(() => EffectActionEntity, {nullable: true})
  public async getEffectAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = EffectActionEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(EffectActionEntity, {id}, {fields, populate});
  }
  
  @Query(() => [EffectActionEntity])
  public async getEffectActionList(@Arg("pagination") pagination: EffectActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = EffectActionEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(EffectActionEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => EffectActionEntity)
  public async createEffectAction(@Arg("data") data: EffectActionCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    const effect = await ctx.entity_manager.findOneOrFail(EffectEntity, {id: data.effect});
    
    const entity = new EffectActionEntity({...data, modifier_list, effect});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => EffectActionEntity)
  public async updateEffectAction(@Arg("id") id: string, @Arg("data") data: EffectActionUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(EffectActionEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => EffectActionEntity)
  public async deleteEffectAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(EffectActionEntity).removeAndFlush({id});
  }
}
