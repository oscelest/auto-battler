import {GraphQLResolveInfo} from "graphql/type";
import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {v4} from "uuid";
import {ComboPointActionEntity, ModifierEntity} from "../../../entities";
import {GraphQLContext} from "../../../Globals";
import {ComboPointActionCreateValidator, ComboPointActionPaginationValidator, ComboPointActionUpdateValidator} from "../../../validators";

@Resolver(() => ComboPointActionEntity)
export class ComboPointActionResolver {
  
  @Query(() => ComboPointActionEntity, {nullable: true})
  public async getComboPointAction(@Arg("id") id: string = v4(), @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    return ComboPointActionEntity.generate({id});
  }
  
  @Query(() => [ComboPointActionEntity])
  public async getComboPointActionList(@Arg("pagination") pagination: ComboPointActionPaginationValidator, @Ctx() ctx: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    const {fields, populate} = ComboPointActionEntity.fromContextToFieldsAndPopulate(info);
    const {offset, limit, orderBy} = pagination;
    
    return await ctx.entity_manager.find(ComboPointActionEntity, {}, {fields, populate, offset, limit, orderBy});
  }
  
  @Mutation(() => ComboPointActionEntity)
  public async createComboPointAction(@Arg("data") data: ComboPointActionCreateValidator, @Ctx() ctx: GraphQLContext) {
    const modifier_list = data.modifier_list ? await ctx.entity_manager.find(ModifierEntity, {id: data.modifier_list}) : [];
    
    const entity = new ComboPointActionEntity({...data, modifier_list});
    await ctx.entity_manager.persistAndFlush(entity);
    
    return entity;
  }
  
  @Mutation(() => ComboPointActionEntity)
  public async updateComboPointAction(@Arg("id") id: string, @Arg("data") data: ComboPointActionUpdateValidator, @Ctx() ctx: GraphQLContext) {
    const entity = await ctx.entity_manager.findOneOrFail(ComboPointActionEntity, {id});
    
    await ctx.entity_manager.persistAndFlush(entity.assign(data));
    
    return entity;
  }
  
  @Mutation(() => ComboPointActionEntity)
  public async deleteComboPointAction(@Arg("id") id: string, @Ctx() ctx: GraphQLContext) {
    return await ctx.entity_manager.getRepository(ComboPointActionEntity).removeAndFlush({id});
  }
}
