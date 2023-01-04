import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ArithmeticalModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {ArithmeticalModifierCreateValidator, ArithmeticalModifierPaginationValidator, ArithmeticalModifierUpdateValidator} from "../../validators/Modifier/ArithmeticModifier.validator";

@Resolver(() => ArithmeticalModifierEntity)
export class ArithmeticalModifierResolver {
  
  @Query(() => ArithmeticalModifierEntity)
  public async getArithmeticalModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = ArithmeticalModifierEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(ArithmeticalModifierEntity, {id}, {fields, populate});
  }
  
  @Query(() => [ArithmeticalModifierEntity])
  public async getArithmeticalModifierList(@Arg("pagination") pagination: ArithmeticalModifierPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = ArithmeticalModifierEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(ArithmeticalModifierEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => ArithmeticalModifierEntity)
  public async createArithmeticalModifier(@Arg("data") data: ArithmeticalModifierCreateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = new ArithmeticalModifierEntity(data);
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => ArithmeticalModifierEntity)
  public async updateArithmeticalModifier(@Arg("id") id: string, @Arg("data") data: ArithmeticalModifierUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(ArithmeticalModifierEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => ArithmeticalModifierEntity)
  public async deleteArithmeticalModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(ArithmeticalModifierEntity).removeAndFlush({id});
  }
}
