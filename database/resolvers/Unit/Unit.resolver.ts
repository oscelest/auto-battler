import {GraphQLResolveInfo} from "graphql";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {UnitEntity, UnitTypeEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {UnitCreateValidator, UnitPaginationValidator, UnitUpdateValidator} from "../../validators/Unit/Unit.validator";

@Resolver(() => UnitEntity)
export class UnitResolver {
  
  @Query(() => UnitEntity, {nullable: true})
  public async getUnit(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = UnitEntity.fromContextToFieldsAndPopulate(info);
  
    return await ctx.entity_manager.findOne(UnitEntity, {id}, {fields, populate});
  }
  
  @Query(() => [UnitEntity])
  public async getUnitList(@Arg("pagination") pagination: UnitPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    console.log("hello");
    const {fields, populate} = UnitEntity.fromContextToFieldsAndPopulate(info);
    console.log("hello2");
    const {offset, limit, orderBy} = pagination;
    console.log("hello3");
    
    return await ctx.entity_manager.find(UnitEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => UnitEntity)
  public async createUnit(@Arg("data") data: UnitCreateValidator, @Ctx() ctx: GraphQLContext) {
    const type = await ctx.entity_manager.findOneOrFail(UnitTypeEntity, {id: data.type});
    
    const entity = new UnitEntity({...data, type});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => UnitEntity)
  public async updateUnit(@Arg("id") id: string, @Arg("data") data: UnitUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(UnitEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => UnitEntity)
  public async deleteUnit(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(UnitEntity).removeAndFlush({id});
  }
}
