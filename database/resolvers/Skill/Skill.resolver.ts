import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ModifierEntity, OperationEntity, SkillEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {SkillCreateValidator, SkillPaginationValidator, SkillUpdateValidator} from "../../validators/Skill/Skill.validator";

@Resolver(() => SkillEntity)
export class SkillResolver {
  
  @Query(() => SkillEntity, {nullable: true})
  public async getSkill(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = SkillEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(SkillEntity, {id}, {fields, populate});
  }
  
  @Query(() => [SkillEntity])
  public async getSkillList(@Arg("pagination") pagination: SkillPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = SkillEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(SkillEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => SkillEntity)
  public async createSkill(@Arg("data") data: SkillCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    const operation_list = data.operation_list ? await ctx.entity_manager.find(OperationEntity, {id: data.operation_list}) : [];
    
    const entity = new SkillEntity({...data, modifier_list, operation_list});
    await ctx.entity_manager.persistAndFlush(entity);
    return entity;
  }
  
  @Mutation(() => SkillEntity)
  public async updateSkill(@Arg("id") id: string, @Arg("data") data: SkillUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(SkillEntity, {id});
    
    entity.assign(data);
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => SkillEntity)
  public async deleteSkill(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(SkillEntity).removeAndFlush({id});
  }
}

