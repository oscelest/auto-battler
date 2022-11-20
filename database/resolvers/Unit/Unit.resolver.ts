import {EntityManager} from "@mikro-orm/core";
import GraphQL from "graphql";
import fieldsToRelations from "graphql-fields-to-relations";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import UnitEntity from "../../entities/Unit/Unit.entity";
import UnitClassEntity from "../../entities/Unit/UnitClass.entity";
import UnitValidator from "../../validators/Unit/Unit.validator";

@Resolver(() => UnitEntity)
export class UnitResolver {
  
  @Query(() => UnitEntity, {nullable: true})
  public async getUnit(@Arg("id") id: string, @Ctx() ctx: MyContext, @Info() info: GraphQL.GraphQLResolveInfo): Promise<UnitEntity | null> {
    // const relationPaths = fieldsToRelations(info);
    console.log(id, ctx, info);
    // return ctx.em.getRepository(UnitEntity).findOne({id});
    return null as any;
  }
  
  @Query(() => [UnitEntity])
  public async getUnitList(@Ctx() ctx: MyContext, @Info() info: GraphQL.GraphQLResolveInfo): Promise<UnitEntity[]> {
    console.log(ctx, info);
  
    const relationPaths = fieldsToRelations(info);
    console.log(relationPaths);
    // return ctx.em.getRepository(UnitEntity).findAll();
    return null as any;
  }
  
  @Mutation(() => UnitEntity)
  public async createUnitEntity(@Arg("input") input: UnitValidator, @Ctx() ctx: MyContext): Promise<UnitEntity> {
    const unit_class = await ctx.em.getRepository(UnitClassEntity).findOneOrFail({id: input.unit_class});
    const entity = new UnitEntity({...input, class: unit_class.toReference().getEntity()});
    
    await ctx.em.persist(entity).flush();
    return entity;
  }
  
  @Mutation(() => UnitEntity)
  public async updateAuthor(@Arg("input") input: UnitValidator, @Arg("id") id: string, @Ctx() ctx: MyContext, @Info() info: GraphQL.GraphQLResolveInfo): Promise<UnitEntity> {
    const relationPaths = fieldsToRelations(info);
    console.log(relationPaths);
    const entity = await ctx.em.getRepository(UnitEntity).findOneOrFail({id});
    
    entity.assign(input);
    await ctx.em.persist(entity).flush();
    return entity;
  }
  
  @Mutation(() => Boolean)
  public async deleteAuthor(@Arg("id") id: string, @Ctx() ctx: MyContext): Promise<boolean> {
    
    const entity = await ctx.em.getRepository(UnitEntity).findOneOrFail({id});
    await ctx.em.getRepository(UnitEntity).remove(entity).flush();
    
    return true;
  }
}

interface MyContext {
  em: EntityManager;
}
