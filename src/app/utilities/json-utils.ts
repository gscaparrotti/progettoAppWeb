export module JSONUtils {
  export function JSONToClass(input: object, classes: Map<string, object>): any {
    let output = Object.create(Object.prototype);
    classes.forEach((classPrototype: object, className: string) => {
      if (className === (<any> input).className) {
        output = Object.create(classPrototype);
      }
    });
    delete (<any> input).className;
    Object.assign(output, input);
    return output;
  }

  export function JSONDate(input: object, fieldNames: string[]): void {
    fieldNames.forEach(fieldName => {
      input[fieldName] = new Date(input[fieldName] !== null ? input[fieldName] : new Date(-1));
    });
  }
}

