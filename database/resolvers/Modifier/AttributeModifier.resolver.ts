import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {AttributeModifierEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {AttributeModifierCreateValidator, AttributeModifierUpdateValidator} from "../../validators/Modifier/AttributeModifier.validator";

@Resolver(() => AttributeModifierEntity)
export class AttributeModifierResolver {
  
  @Query(() => AttributeModifierEntity)
  public async getAttributeModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<AttributeModifierEntity | null> {
    return await ctx.entity_manager.getRepository(AttributeModifierEntity).findOne({id});
  }
  
  @Query(() => [AttributeModifierEntity])
  public async getAttributeModifierList(@Ctx() ctx: GraphQLContext): Promise<AttributeModifierEntity[]> {
    return await ctx.entity_manager.getRepository(AttributeModifierEntity).find({});
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async createAttributeModifier(@Arg("data") data: AttributeModifierCreateValidator, @Ctx() ctx: GraphQLContext): Promise<AttributeModifierEntity> {
    const entity = new AttributeModifierEntity(data);
    await ctx.entity_manager.persist(entity).flush();
    return entity;
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async updateAttributeModifier(@Arg("id") id: string, @Arg("data") data: AttributeModifierUpdateValidator, @Ctx() ctx: GraphQLContext): Promise<AttributeModifierEntity> {
    const {attribute, value, value_per_level, category} = data;
    const entity = await ctx.entity_manager.getRepository(AttributeModifierEntity).findOneOrFail({id});
    if (category !== undefined) entity.category = category;
    if (attribute !== undefined) entity.attribute = attribute;
    if (value_per_level !== undefined) entity.value_per_level = value_per_level;
    if (value !== undefined) entity.value = value;
    
    await ctx.entity_manager.getRepository(AttributeModifierEntity).persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => AttributeModifierEntity)
  public async deleteAttributeModifier(@Arg("id") id: string, @Ctx() ctx: GraphQLContext): Promise<void> {
    return await ctx.entity_manager.getRepository(AttributeModifierEntity).removeAndFlush({id});
  }
}
