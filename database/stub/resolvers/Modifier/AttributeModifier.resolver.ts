import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {AttributeModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {AttributeModifierCreateValidator, AttributeModifierPaginationValidator, AttributeModifierUpdateValidator} from "../../validators/Modifier/AttributeModifier.validator";

@Resolver(() => AttributeModifierEntity)
export class AttributeModifierResolver {
  
  @Query(() => AttributeModifierEntity)
  public async getAttributeModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = AttributeModifierEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(AttributeModifierEntity, {id}, {fields, populate});
  }
  
  @Query(() => [AttributeModifierEntity])
  public async getAttributeModifierList(@Arg("pagination") pagination: AttributeModifierPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = AttributeModifierEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(AttributeModifierEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async createAttributeModifier(@Arg("data") data: AttributeModifierCreateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = new AttributeModifierEntity(data);
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async updateAttributeModifier(@Arg("id") id: string, @Arg("data") data: AttributeModifierUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(AttributeModifierEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async deleteAttributeModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(AttributeModifierEntity).removeAndFlush({id});
  }
}
