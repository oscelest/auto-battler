import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {PeriodicTriggerEntity} from "../../entities/Trigger";
import {GraphQLContext} from "../../Globals";
import {PeriodicTriggerCreateValidator, PeriodicTriggerPaginationValidator, PeriodicTriggerUpdateValidator} from "../../validators/Trigger/PeriodicTrigger.validator";

@Resolver(() => PeriodicTriggerEntity)
export class PeriodicTriggerResolver {
  
  @Query(() => PeriodicTriggerEntity, {nullable: true})
  public async getPeriodicTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = PeriodicTriggerEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(PeriodicTriggerEntity, {id}, {fields, populate});
  }
  
  @Query(() => [PeriodicTriggerEntity])
  public async getPeriodicTriggerList(@Arg("pagination") pagination: PeriodicTriggerPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = PeriodicTriggerEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(PeriodicTriggerEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => PeriodicTriggerEntity)
  public async createPeriodicTrigger(@Arg("data") data: PeriodicTriggerCreateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = new PeriodicTriggerEntity(data);
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => PeriodicTriggerEntity)
  public async updatePeriodicTrigger(@Arg("id") id: string, @Arg("data") data: PeriodicTriggerUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(PeriodicTriggerEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => PeriodicTriggerEntity)
  public async deletePeriodicTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(PeriodicTriggerEntity).removeAndFlush({id});
  }
}

