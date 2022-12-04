import {AutoPath} from "@mikro-orm/core/typings";
import {GraphQLResolveInfo} from "graphql";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {UnitEntity, UnitTypeEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {ASTWalker} from "../../modules/ASTWalker";
import {UnitCreateValidator, UnitPaginationValidator, UnitUpdateValidator} from "../../validators/Unit/Unit.validator";

@Resolver(() => UnitEntity)
export class UnitResolver {
  
  @Query(() => UnitEntity, {nullable: true})
  public async getUnit(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<UnitEntity | null> {
    const populate = ASTWalker.getRelationList(info) as AutoPath<UnitEntity, string>;
    return await ctx.entity_manager.getRepository(UnitEntity).findOne({id}, {populate});
  }
  
  @Query(() => [UnitEntity])
  public async getUnitList(@Arg("pagination") pagination: UnitPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo): Promise<UnitEntity[]> {
    const populate = ASTWalker.getRelationList(info) as AutoPath<UnitEntity, string>;
    const {offset, limit} = pagination;
    
    return await ctx.entity_manager.getRepository(UnitEntity).find({}, {populate, offset, limit, orderBy: pagination.getOrderBy()});
  }
  
  @Mutation(() => UnitEntity)
  public async createUnit(@Arg("data") data: UnitCreateValidator, @Ctx() ctx: GraphQLContext): Promise<UnitEntity> {
    const type = await ctx.entity_manager.getRepository(UnitTypeEntity).findOneOrFail({id: data.type});
    
    const entity = new UnitEntity({...data, type});
    await ctx.entity_manager.persist(entity).flush();
    return entity;
  }
  
  @Mutation(() => UnitEntity)
  public async updateUnit(@Arg("id") id: string, @Arg("data") data: UnitUpdateValidator, @Ctx() ctx: GraphQLContext): Promise<UnitEntity> {
    const entity = await ctx.entity_manager.getRepository(UnitEntity).findOneOrFail({id});
    
    entity.assign(data);
    await ctx.entity_manager.getRepository(UnitEntity).persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => UnitEntity)
  public async deleteUnit(@Arg("id") id: string, @Ctx() ctx: GraphQLContext): Promise<void> {
    return await ctx.entity_manager.getRepository(UnitEntity).removeAndFlush({id});
  }
}
