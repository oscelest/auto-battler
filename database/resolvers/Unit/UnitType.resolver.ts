import {GraphQLResolveInfo} from "graphql";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ModifierEntity, UnitTypeEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {UnitTypeCreateValidator, UnitTypePaginationValidator, UnitTypeUpdateValidator} from "../../validators/Unit/UnitType.validator";

@Resolver(() => UnitTypeEntity)
export class UnitTypeResolver {
  
  @Query(() => UnitTypeEntity, {nullable: true})
  public async getUnitType(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = UnitTypeEntity.fromContextToFieldsAndPopulate(info);
    return await ctx.entity_manager.findOne(UnitTypeEntity, {id}, {fields, populate});
  }
  
  @Query(() => [UnitTypeEntity])
  public async getUnitTypeList(@Arg("pagination") pagination: UnitTypePaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = UnitTypeEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(UnitTypeEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => UnitTypeEntity)
  public async createUnitType(@Arg("data") data: UnitTypeCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new UnitTypeEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => UnitTypeEntity)
  public async updateUnitType(@Arg("id") id: string, @Arg("data") data: UnitTypeUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(UnitTypeEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => UnitTypeEntity)
  public async deleteUnitType(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(UnitTypeEntity).removeAndFlush({id});
  }
}
