export class ValidationError {
  readonly fullCode: string
  constructor(
    readonly fieldCode: string,
    readonly errorCode: string,
  ) {
    this.fullCode = `${fieldCode}.${errorCode}`
  }
}
