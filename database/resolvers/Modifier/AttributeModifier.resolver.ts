import {EntityManager} from "@mikro-orm/core";
import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import {AttributeModifierEntity} from "../../entities";
import AttributeModifierValidator from "../../validators/Modifier/AttributeModifier.validator";

@Resolver(() => AttributeModifierEntity)
export class AttributeModifierResolver {
  
  @Mutation(() => AttributeModifierEntity)
  public async createAttributeModifierEntity(@Arg("input") input: AttributeModifierValidator, @Ctx() ctx: MyContext): Promise<AttributeModifierEntity> {
    const {attribute, value, value_per_level, category} = input;
    const entity = new AttributeModifierEntity({attribute, value, value_per_level, category});
    await ctx.em.persist(entity).flush();
    return entity;
  }
}

interface MyContext {
  em: EntityManager;
}
