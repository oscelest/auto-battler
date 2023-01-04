import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ModifierEntity} from "../../entities";
import {DamageReceivedTriggerEntity} from "../../entities/Trigger";
import {GraphQLContext} from "../../Globals";
import {DamageReceivedTriggerCreateValidator, DamageReceivedTriggerPaginationValidator, DamageReceivedTriggerUpdateValidator} from "../../validators/Trigger/DamageReceivedTrigger.validator";

@Resolver(() => DamageReceivedTriggerEntity)
export class DamageReceivedTriggerResolver {
  
  @Query(() => DamageReceivedTriggerEntity, {nullable: true})
  public async getDamageReceivedTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = DamageReceivedTriggerEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(DamageReceivedTriggerEntity, {id}, {fields, populate});
  }
  
  @Query(() => [DamageReceivedTriggerEntity])
  public async getDamageReceivedTriggerList(@Arg("pagination") pagination: DamageReceivedTriggerPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = DamageReceivedTriggerEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(DamageReceivedTriggerEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => DamageReceivedTriggerEntity)
  public async createDamageReceivedTrigger(@Arg("data") data: DamageReceivedTriggerCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new DamageReceivedTriggerEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => DamageReceivedTriggerEntity)
  public async updateDamageReceivedTrigger(@Arg("id") id: string, @Arg("data") data: DamageReceivedTriggerUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(DamageReceivedTriggerEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => DamageReceivedTriggerEntity)
  public async deleteDamageReceivedTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(DamageReceivedTriggerEntity).removeAndFlush({id});
  }
}

