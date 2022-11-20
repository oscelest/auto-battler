import {NamingStrategy as INamingStrategy} from "@mikro-orm/core";

export default class NamingStrategy implements INamingStrategy {
  public aliasName(entityName: string, index: number): string {
    return `${entityName}-index`;
  }
  
  public columnNameToProperty(columnName: string): string {
    return columnName;
  }
  
  public indexName(tableName: string, columns: string[], type: "primary" | "foreign" | "unique" | "index" | "sequence" | "check"): string {
    return `${tableName}-${columns.join(":")}-${type}`;
  }
  
  public classToMigrationName(timestamp: string): string {
    return `migration_${timestamp}`;
  }
  
  public classToTableName(entityName: string): string {
    return entityName;
  }
  
  public getClassName(file: string, separator?: string): string {
    return file;
  }
  
  public joinColumnName(propertyName: string): string {
    return `join/${propertyName}`;
  }
  
  public joinKeyColumnName(entityName: string, referencedColumnName?: string, composite?: boolean): string {
    return referencedColumnName ? `${entityName}_${referencedColumnName}` : `${entityName}`;
  }
  
  public joinTableName(sourceEntity: string, targetEntity: string, propertyName: string): string {
    return `jct/${sourceEntity}-${targetEntity}`;
  }
  
  public propertyToColumnName(propertyName: string): string {
    return propertyName;
  }
  
  public referenceColumnName(): string {
    return "reference";
  }
  
}
