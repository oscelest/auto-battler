import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ExpirationTriggerEntity} from "../../entities/Trigger";
import {GraphQLContext} from "../../Globals";
import {ExpirationTriggerCreateValidator, ExpirationTriggerPaginationValidator, ExpirationTriggerUpdateValidator} from "../../validators/Trigger/ExpirationTrigger.validator";

@Resolver(() => ExpirationTriggerEntity)
export class ExpirationTriggerResolver {
  
  @Query(() => ExpirationTriggerEntity, {nullable: true})
  public async getExpirationTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = ExpirationTriggerEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(ExpirationTriggerEntity, {id}, {fields, populate});
  }
  
  @Query(() => [ExpirationTriggerEntity])
  public async getExpirationTriggerList(@Arg("pagination") pagination: ExpirationTriggerPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = ExpirationTriggerEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(ExpirationTriggerEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => ExpirationTriggerEntity)
  public async createExpirationTrigger(@Arg("data") data: ExpirationTriggerCreateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = new ExpirationTriggerEntity(data);
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => ExpirationTriggerEntity)
  public async updateExpirationTrigger(@Arg("id") id: string, @Arg("data") data: ExpirationTriggerUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(ExpirationTriggerEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => ExpirationTriggerEntity)
  public async deleteExpirationTrigger(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(ExpirationTriggerEntity).removeAndFlush({id});
  }
}

