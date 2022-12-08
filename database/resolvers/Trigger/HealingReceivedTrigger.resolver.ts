import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ModifierEntity} from "../../entities";
import {HealingReceivedTriggerEntity} from "../../entities/Trigger";
import {GraphQLContext} from "../../Globals";
import {HealingReceivedTriggerCreateValidator, HealingReceivedTriggerPaginationValidator, HealingReceivedTriggerUpdateValidator} from "../../validators/Trigger/HealingReceivedTrigger.validator";

@Resolver(() => HealingReceivedTriggerEntity)
export class HealingReceivedTriggerResolver {
  
  @Query(() => HealingReceivedTriggerEntity, {nullable: true})
  public async getHealingReceivedTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = HealingReceivedTriggerEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(HealingReceivedTriggerEntity, {id}, {fields, populate});
  }
  
  @Query(() => [HealingReceivedTriggerEntity])
  public async getHealingReceivedTriggerList(@Arg("pagination") pagination: HealingReceivedTriggerPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = HealingReceivedTriggerEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(HealingReceivedTriggerEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => HealingReceivedTriggerEntity)
  public async createHealingReceivedTrigger(@Arg("data") data: HealingReceivedTriggerCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new HealingReceivedTriggerEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => HealingReceivedTriggerEntity)
  public async updateHealingReceivedTrigger(@Arg("id") id: string, @Arg("data") data: HealingReceivedTriggerUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(HealingReceivedTriggerEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => HealingReceivedTriggerEntity)
  public async deleteHealingReceivedTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(HealingReceivedTriggerEntity).removeAndFlush({id});
  }
}

