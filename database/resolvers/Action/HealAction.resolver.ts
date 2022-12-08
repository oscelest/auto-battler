import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {HealActionEntity, ModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {HealActionCreateValidator, HealActionPaginationValidator, HealActionUpdateValidator} from "../../validators/Action/HealAction.validator";

@Resolver(() => HealActionEntity)
export class HealActionResolver {
  
  @Query(() => HealActionEntity, {nullable: true})
  public async getHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = HealActionEntity.fromContextToFieldsAndPopulate(info);
  
    return await ctx.entity_manager.findOne(HealActionEntity, {id}, {fields, populate});
  }
  
  @Query(() => [HealActionEntity])
  public async getHealActionList(@Arg("pagination") pagination: HealActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = HealActionEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(HealActionEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => HealActionEntity)
  public async createHealAction(@Arg("data") data: HealActionCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new HealActionEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => HealActionEntity)
  public async updateHealAction(@Arg("id") id: string, @Arg("data") data: HealActionUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(HealActionEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => HealActionEntity)
  public async deleteHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(HealActionEntity).removeAndFlush({id});
  }
}
