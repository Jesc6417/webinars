export class UseCaseProxy<T> {
  constructor(private useCase: T) {
    this.useCase = useCase;
  }
  getInstance() {
    return this.useCase;
  }
}
