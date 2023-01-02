import gql from "graphql-tag";

export const MyQuery = gql`
query MyQuery($pagination: AttributeModifierPaginationValidator!) {
  getAttributeModifierList(pagination: $pagination) {
    category
    created_at
    type
  }
}
`;
