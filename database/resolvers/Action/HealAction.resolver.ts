import {QueryOrderMap} from "@mikro-orm/core";
import {AutoPath} from "@mikro-orm/core/typings";
import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {HealActionEntity, ModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {ASTWalker} from "../../modules/ASTWalker";
import {HealActionCreateValidator, HealActionPaginationValidator, HealActionUpdateValidator} from "../../validators/Action/HealAction.validator";

@Resolver(() => HealActionEntity)
export class HealActionResolver {
  
  @Query(() => HealActionEntity, {nullable: true})
  public async getHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<HealActionEntity | null> {
    const populate = ASTWalker.getRelationList(info) as AutoPath<HealActionEntity, string>;
    return await ctx.entity_manager.getRepository(HealActionEntity).findOne({id}, {populate});
  }
  
  @Query(() => [HealActionEntity])
  public async getHealActionList(@Arg("pagination") pagination: HealActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<HealActionEntity[]> {
    const populate = ASTWalker.getRelationList(info) as AutoPath<HealActionEntity, string>;
    const {offset, limit, order_by = {}} = pagination;
    for (let key of Object.keys(order_by)) {
      let k = key as keyof typeof order_by;
      if (order_by[k] === undefined) delete order_by[k];
    }
    
    return await ctx.entity_manager.getRepository(HealActionEntity).find({}, {populate, offset, limit, orderBy: {...order_by} as QueryOrderMap<HealActionEntity>});
  }
  
  @Mutation(() => HealActionEntity)
  public async createHealAction(@Arg("data") data: HealActionCreateValidator, @Ctx() ctx: GraphQLContext): Promise<HealActionEntity> {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.getRepository(ModifierEntity).find({id: data.modifier_list}) : [];
    
    const entity = new HealActionEntity({...data, modifier_list});
    await ctx.entity_manager.persist(entity).flush();
    return entity;
  }
  
  @Mutation(() => HealActionEntity)
  public async updateHealAction(@Arg("id") id: string, @Arg("data") data: HealActionUpdateValidator, @Ctx() ctx: GraphQLContext): Promise<HealActionEntity> {
    const {periodic, reviving, direct} = data;
    const entity = await ctx.entity_manager.getRepository(HealActionEntity).findOneOrFail({id});
    if (periodic !== undefined) entity.periodic = periodic;
    if (reviving !== undefined) entity.reviving = reviving;
    if (direct !== undefined) entity.direct = direct;
    
    await ctx.entity_manager.getRepository(HealActionEntity).persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => HealActionEntity)
  public async deleteHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext): Promise<void> {
    return await ctx.entity_manager.getRepository(HealActionEntity).removeAndFlush({id});
  }
}
