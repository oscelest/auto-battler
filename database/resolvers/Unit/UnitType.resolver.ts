import {AutoPath} from "@mikro-orm/core/typings";
import {GraphQLResolveInfo} from "graphql";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ModifierEntity, UnitEntity, UnitTypeEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {ASTWalker} from "../../modules/ASTWalker";
import {UnitTypeCreateValidator, UnitTypePaginationValidator, UnitTypeUpdateValidator} from "../../validators/Unit/UnitType.validator";

@Resolver(() => UnitTypeEntity)
export class UnitTypeResolver {
  
  @Query(() => UnitTypeEntity, {nullable: true})
  public async getUnitType(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<UnitTypeEntity | null> {
    const {fields, populate} = ASTWalker.getFieldsAndPopulate(info) as AutoPath<UnitEntity, string>;
    return await ctx.entity_manager.getRepository(UnitTypeEntity).findOne({id}, {fields, populate});
  }
  
  @Query(() => [UnitTypeEntity])
  public async getUnitTypeList(@Arg("pagination") pagination: UnitTypePaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<UnitTypeEntity[]> {
    const {fields, populate} = ASTWalker.getFieldsAndPopulate(info) as AutoPath<UnitEntity, string>;
    const {offset, limit} = pagination;
  
    return await ctx.entity_manager.getRepository(UnitTypeEntity).find({}, {fields, populate, offset, limit, orderBy: pagination.getOrderBy()});
  }
  
  @Mutation(() => UnitTypeEntity)
  public async createUnitType(@Arg("data") data: UnitTypeCreateValidator, @Ctx() ctx: GraphQLContext): Promise<UnitTypeEntity> {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.getRepository(ModifierEntity).find({id: data.modifier_list}) : [];
    
    const entity = new UnitTypeEntity({...data, modifier_list});
    await ctx.entity_manager.persist(entity).flush();
    
    return entity;
  }
  
  @Mutation(() => UnitTypeEntity)
  public async updateUnitType(@Arg("id") id: string, @Arg("data") data: UnitTypeUpdateValidator, @Ctx() ctx: GraphQLContext): Promise<UnitTypeEntity> {
    const entity = await ctx.entity_manager.getRepository(UnitTypeEntity).findOneOrFail({id});
    
    entity.assign(data);
    await ctx.entity_manager.getRepository(UnitTypeEntity).persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => UnitTypeEntity)
  public async deleteUnitType(@Arg("id") id: string, @Ctx() ctx: GraphQLContext): Promise<void> {
    return await ctx.entity_manager.getRepository(UnitTypeEntity).removeAndFlush({id});
  }
}
