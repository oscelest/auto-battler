import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {HealActionEntity, ModifierEntity, UnitEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {ASTWalker} from "../../modules/ASTWalker";
import {HealActionCreateValidator, HealActionPaginationValidator, HealActionUpdateValidator} from "../../validators/Action/HealAction.validator";

@Resolver(() => HealActionEntity)
export class HealActionResolver {
  
  @Query(() => HealActionEntity, {nullable: true})
  public async getHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<HealActionEntity | null> {
    const {fields, populate} = ASTWalker.getFieldsAndPopulate<UnitEntity>(info);
  
    return await ctx.entity_manager.getRepository(HealActionEntity).findOne({id}, {fields, populate});
  }
  
  @Query(() => [HealActionEntity])
  public async getHealActionList(@Arg("pagination") pagination: HealActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<HealActionEntity[]> {
    const {fields, populate} = ASTWalker.getFieldsAndPopulate<UnitEntity>(info);
    const {offset, limit} = pagination;
  
    return await ctx.entity_manager.getRepository(HealActionEntity).find({}, {fields, populate, offset, limit, orderBy: pagination.getOrderBy()});
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
    const entity = await ctx.entity_manager.getRepository(HealActionEntity).findOneOrFail({id});
  
    entity.assign(data);
    await ctx.entity_manager.getRepository(HealActionEntity).persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => HealActionEntity)
  public async deleteHealAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext): Promise<void> {
    return await ctx.entity_manager.getRepository(HealActionEntity).removeAndFlush({id});
  }
}
