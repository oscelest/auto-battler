import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {DamageActionEntity, ModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {DamageActionCreateValidator, DamageActionPaginationValidator, DamageActionUpdateValidator} from "../../validators";

@Resolver(() => DamageActionEntity)
export class DamageActionResolver {
  
  @Query(() => DamageActionEntity, {nullable: true})
  public async getDamageAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = DamageActionEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(DamageActionEntity, {id}, {fields, populate});
  }
  
  @Query(() => [DamageActionEntity])
  public async getDamageActionList(@Arg("pagination") pagination: DamageActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = DamageActionEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(DamageActionEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => DamageActionEntity)
  public async createDamageAction(@Arg("data") data: DamageActionCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new DamageActionEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => DamageActionEntity)
  public async updateDamageAction(@Arg("id") id: string, @Arg("data") data: DamageActionUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(DamageActionEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => DamageActionEntity)
  public async deleteDamageAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(DamageActionEntity).removeAndFlush({id});
  }
}
