import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {ActionEntity, ModifierEntity, OperationEntity} from "../../entities";
import {GraphQLContext} from "../../Globals";
import {OperationCreateValidator, OperationPaginationValidator, OperationUpdateValidator} from "../../validators/Operation/Operation.validator";

@Resolver(() => OperationEntity)
export class OperationResolver {
  
  @Query(() => OperationEntity, {nullable: true})
  public async getOperation(@Arg("id") id: string, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = OperationEntity.fromContextToFieldsAndPopulate(info);
    
    return await ctx.entity_manager.findOne(OperationEntity, {id}, {fields, populate});
  }
  
  @Query(() => [OperationEntity])
  public async getOperationList(@Arg("pagination") pagination: OperationPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = OperationEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(OperationEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => OperationEntity)
  public async createOperation(@Arg("data") data: OperationCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    const action_list = data.action_list ? await ctx.entity_manager.find(ActionEntity, {id: data.action_list}) : [];
    const entity = new OperationEntity({...data, modifier_list, action_list});
    
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => OperationEntity)
  public async updateOperation(@Arg("id") id: string, @Arg("data") data: OperationUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(OperationEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => OperationEntity)
  public async deleteOperation(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(OperationEntity).removeAndFlush({id});
  }
}
